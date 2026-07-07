import { redisKey } from "@/constants/resolve-key/redis-key";
import {
  BadRequestException,
  NotFoundException,
} from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { pineProducer } from "@/modules/job/pine-vector/producer/pine.producer";
import { mixedBreadService } from "@/modules/mixed-bread/service/mixed-bread.service";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import { pineconeService } from "@/modules/pinecone/service/pinecone.service";
import type {
  CreateCirclePostPayload,
  CreatePostPayload
} from "@/modules/post/interfaces/create-post-payload";
import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { userActionLogService } from "@/modules/user-action-log/service/user-action-log.service";
import { followerService } from "@/modules/user/service/follower.service";
import { userService } from "@/modules/user/service/user.service";
import { redisService } from "@/providers/redis.provider";
import { redisVersion } from "@/shared/redis-version";
import { transactionService } from "@/shared/transaction/transaction.service";
import {
  Prisma,
  ReplyPermission,
  VisibilityPost,
} from "@prisma/client";
import { CreatePostDto } from "../dto/post.dto";
import { normalizeTopic } from "../helper/nomalize.hepler";
import { PostRecord, postRepository } from "../repository/post.repository";
import { postMentionService } from "./post-mention.service";
import { postMetaService, type CreatePostMeta } from "./post-meta.service";

class PostService {
  private readonly similarPostsCacheTtlSeconds = 300;

  private resolveReplyPermission(
    replyPermission?: ReplyPermission,
  ): ReplyPermission {
    const normalized = (replyPermission ?? ReplyPermission.EVERYONE)
      .trim()
      .toUpperCase();
    if (
      !Object.values(ReplyPermission).includes(normalized as ReplyPermission)
    ) {
      throw new BadRequestException(
        `replyPermission must be one of: ${Object.values(ReplyPermission).join(", ")}`,
      );
    }

    return normalized as ReplyPermission;
  }

  private resolveVisibility(visibility?: VisibilityPost): VisibilityPost {
    const normalized = (visibility ?? VisibilityPost.PUBLIC)
      .trim()
      .toUpperCase();
    if (!Object.values(VisibilityPost).includes(normalized as VisibilityPost)) {
      throw new BadRequestException(
        `visibility must be one of: ${Object.values(VisibilityPost).join(", ")}`,
      );
    }

    return normalized as VisibilityPost;
  }

  private async resolveUser(userId: string) {
    const userSnapshot = await userService.findByUserId(userId);
    if (!userSnapshot) throw new NotFoundException("User not found");
    return PostMapper.toUserSnapshot(userSnapshot);
  }

  private async resolveOriginPost(publicId: string) {
    const post = await postRepository.findOriginReferenceByPublicId(publicId);
    if (!post) throw new NotFoundException("Origin post not found");
    return post;
  }

  private resolvePostOptions(
    payload: {
      replyPermission?: ReplyPermission;
      visibility?: VisibilityPost;
    },
  ) {
    return {
      replyPermission: this.resolveReplyPermission(payload.replyPermission),
      visibility: this.resolveVisibility(payload.visibility),
    };
  }

  private async createInTransaction(
    createFn: (tx: Prisma.TransactionClient) => Promise<PostRecord>,
    meta?: CreatePostMeta,
  ): Promise<PostRecord> {
    return transactionService.doInTransaction(async (tx) => {
      const post = await createFn(tx);

      if (!post.id) throw new BadRequestException("Failed to create post");

      await postMetaService.attachPostMeta(tx, post.id, meta);
      return post;
    });
  }

  // ---- Creation flows ----

  async create(payload: CreatePostPayload) {
    const snapshot = await this.resolveUser(payload.userId);
    const options = this.resolvePostOptions(payload);
    const normalizedTopic = normalizeTopic(payload.topic);
    //Validate mentions
    const mentionIds = await postMentionService.validateMentions(payload.mentions);

    // Create post and attach meta in a transaction
    const post = await this.createInTransaction(
      (tx) => postRepository.create({ ...payload, ...options }, snapshot, tx),
      { topic: payload.topic, mentionIds },
    );

    await Promise.all([
      pineProducer.addToPineconeQueue({
        content: payload.content,
        topic: [normalizedTopic ?? "not"],
        postId: post.id || 0,
        userId: payload.userId,
      }),
      userActionLogService.logPostCreated({
        userId: payload.userId,
        targetId: post.publicId,
        metadata: {
          postId: post.id ?? null,
          source: "POST",
        },
      }),
      postMentionService.dispatchMentionNotifications({
        mentionIds,
        actorId: payload.userId,
        username: snapshot.username,
        avatar: snapshot.avatar,
        targetPostId: post.publicId,
        originPostId: post.publicId,
        postOwnerId: payload.userId,
        content: payload.content,
      }),
      redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace()),
    ]);
    return post;
  }

  async createCircle(payload: CreateCirclePostPayload) {
    const snapshot = await this.resolveUser(payload.userId);
    const options = this.resolvePostOptions({
      visibility: VisibilityPost.CIRCLE,
      replyPermission: ReplyPermission.EVERYONE,
    });

    baseLogger.info(`Resolved post options: ${JSON.stringify(payload)}`);

    const post = await postRepository.createCircle(
      { ...payload, ...options }, snapshot,
    )

    if (payload.mediaUrls?.length) {
      await postRepository.createCirclePostMedia(
        post.id!,
        payload.mediaUrls,
      )
    }
    await pineProducer.addToPineconeQueue({
      content: payload.content,
      postId: post.id || 0,
      userId: payload.userId,
    });

    await userActionLogService.logPostCreated({
      userId: payload.userId,
      targetId: post.publicId,
      metadata: {
        postId: post.id ?? null,
        source: "CIRCLE_POST",
      },
    });

    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
    return post;
  }

  async reply(publicId: string, payload: CreatePostDto & { userId: string }) {
    const snapshot = await this.resolveUser(payload.userId);
    const mentionIds = await postMentionService.validateMentions(payload.mentions);
    const options = this.resolvePostOptions(payload);
    const existPost = await postRepository.findByPublicId(publicId);
    if (!existPost) {
      throw new NotFoundException("Origin post not found");
    }
    const post = await this.createInTransaction(
      (tx) =>
        postRepository.createReply(
          { ...payload, ...options },
          {
            id: existPost.id,
            publicId: existPost.publicId,
          },
          snapshot,
          tx,
        ),
      { topic: payload.topic, mentionIds },
    );
    baseLogger.info("Created reply post, adding notification group");
    const notificationTasks: Promise<unknown>[] = [
      postMentionService.dispatchMentionNotifications({
        mentionIds,
        actorId: payload.userId,
        username: snapshot.username,
        avatar: snapshot.avatar,
        targetPostId: post.publicId,
        originPostId: existPost.publicId,
        postOwnerId: existPost.userId,
        content: payload.content,
      }),
    ];

    if (!mentionIds.length) {
      notificationTasks.push(
        notificationService.handleNewComment({
          replyContent: payload.content,
          actorId: payload.userId,
          recipientId: existPost.userId,
          targetPostId: post.publicId,
          originPostId: existPost.publicId,
          postOwnerId: existPost.userId,
          username: snapshot.username,
          avatar: snapshot.avatar,
        }),
      );
    }

    await Promise.all([
      ...notificationTasks,
      redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace()),
    ]);
    return {
      publicId: post.publicId,
      content: post.content!,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async createCircleReply(
    publicId: string,
    payload: CreatePostDto & { userId: string },
  ) {
    const snapshot = await this.resolveUser(payload.userId);
    const mentionIds = await postMentionService.validateMentions(payload.mentions);
    const options = this.resolvePostOptions({
      visibility: payload.visibility ?? VisibilityPost.CIRCLE,
      replyPermission: payload.replyPermission ?? ReplyPermission.EVERYONE,
    });
    const existPost = await postRepository.findByPublicId(publicId);
    if (!existPost) {
      throw new NotFoundException("Origin post not found");
    }

    const post = await this.createInTransaction(
      (tx) =>
        postRepository.createCircleReply(
          { ...payload, ...options },
          {
            id: existPost.id,
            publicId: existPost.publicId,
          },
          snapshot,
          tx,
        ),
      { topic: payload.topic, mentionIds },
    );

    baseLogger.info("Created circle reply post, adding notification group");

    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
    return {
      publicId: post.publicId,
      content: post.content!,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async repost(publicId: string, userId: string) {
    const snapshot = await this.resolveUser(userId);
    const originPost = await this.resolveOriginPost(publicId);
    const resolvedOriginPostId =
      originPost.rootPostId ?? originPost.originPostId ?? originPost.id;
    const resolvedOriginPublicId =
      originPost.rootPublicId ?? originPost.originPublicId ?? originPost.publicId;

    const post = await postRepository.createRepost(
      { userId },
      resolvedOriginPublicId,
      snapshot,
      resolvedOriginPostId,
    );

    await userActionLogService.logShareCreated({
      userId,
      targetId: post.publicId,
      metadata: {
        originPublicId: resolvedOriginPublicId,
        originPostId: resolvedOriginPostId,
      },
    });
    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
    return {
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async quote(publicId: string, payload: CreatePostDto & { userId: string }) {
    const snapshot = await this.resolveUser(payload.userId);
    const originPost = await this.resolveOriginPost(publicId);
    const mentionIds = await postMentionService.validateMentions(payload.mentions);
    const options = this.resolvePostOptions(payload);
    const resolvedOriginPostId =
      originPost.rootPostId ?? originPost.originPostId ?? originPost.id;
    const resolvedOriginPublicId =
      originPost.rootPublicId ?? originPost.originPublicId ?? originPost.publicId;

    const post = await this.createInTransaction(
      (tx) =>
        postRepository.createQuote(
          { ...payload, ...options },
          resolvedOriginPublicId,
          snapshot,
          resolvedOriginPostId,
          tx,
        ),
      { topic: payload.topic, mentionIds },
    );

    await Promise.all([
      userActionLogService.logQuoteCreated({
        userId: payload.userId,
        targetId: post.publicId,
        metadata: {
          originPublicId: resolvedOriginPublicId,
          originPostId: resolvedOriginPostId,
        },
      }),
      postMentionService.dispatchMentionNotifications({
        mentionIds,
        actorId: payload.userId,
        username: snapshot.username,
        avatar: snapshot.avatar,
        targetPostId: post.publicId,
        originPostId: resolvedOriginPublicId,
        postOwnerId: originPost.userId,
        content: payload.content,
      }),
      redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace()),
    ]);
    return {
      publicId: post.publicId,
      content: post.content,
      userId: payload.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: new Date().toISOString(),
    } as PostRecord;
  }

  async list(): Promise<PostRecord[]> {
    return postRepository.list();
  }

  async search(query: {
    q: string;
    topics: string;
    limit: string;
    page: string;
  }): Promise<any[]> {
    const { q, topics, limit, page } = query;
    const embedding = await mixedBreadService.generateEmbedding(
      q,
      topics.split(","),
    );
    const results = await pineconeService.querySimilarPosts(
      embedding,
      Number(limit) || 10,
    );

    return results;
  }

  async count(userId: string) {
    return postRepository.countPostBydUserId(userId);
  }

  async getSimilarPosts(
    publicId: string,
    payload: { content: string; topic: string[] },
  ) {
    const cacheKey = redisKey.post.similars(publicId);
    const cached = await redisService.get(cacheKey);

    if (cached) {
      try {
        const posts = JSON.parse(cached);
        if (Array.isArray(posts)) {
          return posts.map((post) => ({
            userSnapshot: post.userSnapshot,
            content: post.content,
            publicId: post.publicId,
            createdAt: post.createdAt,
          }));
        }
      } catch {
        // Ignore malformed cache and generate a fresh result.
      }
    }

    const currentPost = await postRepository.findByPublicId(publicId);
    if (!currentPost) {
      throw new NotFoundException("Post not found");
    }

    const embedding = await mixedBreadService.generateEmbedding(
      payload.content,
      payload.topic,
    );
    const matches = await pineconeService.querySimilarPosts(embedding, 6);
    const similarIds = matches
      .map((match) => Number(match.postId))
      .filter(
        (postId, index, ids) =>
          Number.isInteger(postId) &&
          postId > 0 &&
          postId !== currentPost.id &&
          ids.indexOf(postId) === index,
      )
      .slice(0, 5);

    const posts = await postRepository.findByIds(similarIds);
    const postById = new Map(posts.map((post) => [post.id, post]));
    const result = similarIds.flatMap((id) => {
      const post = postById.get(id);
      return post
        ? [
          {
            userSnapshot: post.userSnapshot,
            content: post.content,
            publicId: post.publicId,
            createdAt: post.createdAt,
          },
        ]
        : [];
    });

    await redisService.set(cacheKey, JSON.stringify(result), {
      EX: this.similarPostsCacheTtlSeconds,
    });

    return result;
  }

  async findById(id: number): Promise<{ publicId: string } | null> {
    return postRepository.findById(id);
  }

  async searchByContent({
    query,
    after,
    take,
    userId,
  }: {
    query: string;
    after?: string;
    take: number;
    userId?: string;
  }) {
    const posts = await postRepository.searchByContent({
      q: query,
      after,
      take,
      userId,
    });

    const authorIds = [...new Set(posts.map((post) => post.userId))];
    const following = await followerService.getUserFollowingPostByAuth(
      userId ?? "",
      authorIds,
    );
    const followers = await followerService.getUserFollowersByAuth(
      userId ?? "",
      authorIds,
    );
    const followingSet = new Set(following.map((row) => row.followingId));
    const followerSet = new Set(followers.map((row) => row.userId));

    return posts.map((post) =>
      PostMapper.toFeedResponse(
        {
          ...post,
          isFollowingAuthor: followingSet.has(post.userId),
          isFollowedByAuthor: followerSet.has(post.userId),
        },
        userId,
      ),
    );
  }
}

export const postService = new PostService();
