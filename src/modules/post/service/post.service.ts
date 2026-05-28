import { QUEUE_NAME } from "@/constants/queue";
import { redisKey } from "@/constants/resolve-key/redis-key";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { elasticProducer } from "@/modules/job/elastic-search/producer/elastic.producer";
import { evaluationProducer } from "@/modules/job/evaluation-post/producer/evaluation.producer";
import { pineProducer } from "@/modules/job/pine-vector/producer/pine.producer";
import { mixedBreadService } from "@/modules/mixed-bread/service/mixed-bread.service";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import { pineconeService } from "@/modules/pinecone/service/pinecone.service";
import { NewFeedType } from "@/modules/post/enum";
import {
  buildNewFeedWhere,
  buildQuoteWhere,
  buildRepliesWhere,
  buildUserPostsWhere,
} from "@/modules/post/helper";
import type {
  CreateCirclePostPayload,
  CreatePostPayload,
} from "@/modules/post/interfaces/create-post-payload";
import type { GetPostWithPublicId } from "@/modules/post/interfaces/get-post-with-public-id";
import type { GetPostWithUser } from "@/modules/post/interfaces/get-post-with-user";
import type { NewsFeedPayload } from "@/modules/post/interfaces/news-feed-payload";
import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { reportService } from "@/modules/report/service/report.service";
import { userActionLogService } from "@/modules/user-action-log/service/user-action-log.service";
import { followerService } from "@/modules/user/service/follower.service";
import { userService } from "@/modules/user/service/user.service";
import { redisService } from "@/providers/redis.provider";
import {
  buildCursorPagination,
  buildPagination,
} from "@/shared/pagination/cursor-pagination";
import { transactionService } from "@/shared/transaction/transaction.service";
import {
  ActionType,
  PostType,
  Prisma,
  ReplyPermission,
  ReportStatus,
  ReportTargetType,
  VisibilityPost,
} from "@prisma/client";
import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import { normalizeTopic } from "../helper/nomalize.hepler";
import { PostRecord, postRepository } from "../repository/post.repository";
import { topicsPostRepository } from "../repository/topics-post.repository";

type ReportSubmissionResult = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  evaluationQueued: boolean;
};

class PostService {
  private readonly postListCacheTtlSeconds = 60;
  private readonly circlePostTypes = new Set<PostType>([
    PostType.CIRCLE,
    PostType.CIRCLE_REPLY,
  ]);

  async getJudgeStatus(postId: number) {
    return {
      postId,
      status: "pending" as "pending" | "done",
      score: undefined,
      category: undefined,
      hpDelta: undefined,
      expDelta: undefined,
    };
  }

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
    meta: { topic?: string; mentionIds: string[] },
  ): Promise<PostRecord> {
    return transactionService.doInTransaction(async (tx) => {
      const post = await createFn(tx);

      if (!post.id) throw new BadRequestException("Failed to create post");

      await this.attachPostMeta(tx, post.id, meta);
      return post;
    });
  }

  private async validateMentions(
    mentions?: CreatePostPayload["mentions"],
  ): Promise<string[]> {
    if (!mentions?.length) {
      return [];
    }

    if (mentions.length > 5) {
      throw new BadRequestException("Mentions must be at most 5 users");
    }

    const mentionIds = mentions.map((mention) => mention.userId);
    const uniqueMentionIds = [...new Set(mentionIds)];

    if (uniqueMentionIds.length !== mentionIds.length) {
      throw new BadRequestException(
        "Mentions must not contain duplicate users",
      );
    }

    const existingIds = await userService.findExistingIds(uniqueMentionIds);

    if (existingIds.length !== uniqueMentionIds.length) {
      throw new BadRequestException("One or more mentioned users do not exist");
    }

    return uniqueMentionIds;
  }

  private async dispatchMentionNotifications({
    mentionIds,
    actorId,
    username,
    avatar,
    targetPostId,
    originPostId,
    postOwnerId,
    content,
  }: {
    mentionIds: string[];
    actorId: string;
    username: string;
    avatar?: string;
    targetPostId: string;
    originPostId: string;
    postOwnerId: string;
    content: string;
  }): Promise<void> {
    if (!mentionIds.length) return;

    const recipientIds = mentionIds.filter((recipientId) => recipientId !== actorId);
    if (!recipientIds.length) return;

    const results = await Promise.allSettled(
      recipientIds.map((recipientId) =>
        notificationService.handleMention({
          mentionContent: content,
          actorId,
          recipientId,
          targetPostId,
          originPostId,
          username,
          avatar,
          postOwnerId,
        }),
      ),
    );

    results.forEach((result, index) => {
      if (result.status === "fulfilled") return;
      const recipientId = recipientIds[index];
      const message =
        result.reason instanceof Error ? result.reason.message : String(result.reason);
      baseLogger.error(
        `[mention-notification] Failed to enqueue mention notification for recipient ${recipientId}: ${message}`,
      );
    });
  }

  private async attachPostMeta(
    tx: Prisma.TransactionClient,
    postId: number,
    payload: { topic?: string; mentionIds: string[] },
  ): Promise<void> {
    if (payload.mentionIds.length) {
      await tx.postMention.createMany({
        data: payload.mentionIds.map((userId) => ({
          postId,
          userId,
        })),
      });
    }

    const normalizedTopic = normalizeTopic(payload.topic);

    if (normalizedTopic) {
      await topicsPostRepository.create(
        {
          postId,
          topicName: normalizedTopic,
        },
        tx,
      );
    }
  }

  private async paginatePosts({
    after,
    take,
    where,
    userId,
  }: {
    after?: string;
    take: number;
    where: Prisma.PostWhereInput;
    userId?: string | null;
  }) {
    const { currentAfter, currentLimit } = buildPagination({ after, take });

    const posts = await postRepository.findAll({
      after: currentAfter ?? undefined,
      take: currentLimit + 1,
      where,
      props: {
        userId,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      },
    });

    const authorIds = [...new Set(posts.map((post) => post.userId))];
    const following = await followerService.getUserFollowingPostByAuth(userId ?? "", authorIds);
    const follower = await followerService.getUserFollowersByAuth(userId ?? "", authorIds);
    const followingSet = new Set(
      following.map((row) => row.followingId)
    );
    const followerSet = new Set(
      follower.map((row) => row.userId)
    );

    const data = posts.map((post) => ({
      ...post,
      isFollowingAuthor: followingSet.has(post.userId),
      isFollowedByAuthor: followerSet.has(post.userId),
    }));


    const rows = data.map((post) =>
      PostMapper.toFeedResponse(post, userId ?? undefined),
    );

    const paginationResult = buildCursorPagination({
      rows,
      take: currentLimit,
      getAfter: (item) => item.publicId,
    });

    return {
      posts: paginationResult.rows,
      pagination: paginationResult.pagination,
    };
  }

  private cacheSegment(value?: string | null) {
    return encodeURIComponent(value ?? "none");
  }

  private async getPostListCacheVersion() {
    const versionRaw = await redisService.get(redisKey.post.listVersion());
    const version = Number(versionRaw);
    return Number.isFinite(version) && version >= 0 ? version : 0;
  }

  private async bumpPostListCacheVersion() {
    await redisService.incr(redisKey.post.listVersion());
  }

  private async getCachedPostList(params: {
    scope: string;
    after?: string;
    take: number;
    userId?: string | null;
    extra?: string;
    resolver: () => Promise<{ posts: any[]; pagination: any }>;
  }) {
    const version = await this.getPostListCacheVersion();
    const cacheKey = redisKey.post.list(
      version,
      this.cacheSegment(params.scope),
      this.cacheSegment(params.after),
      params.take,
      this.cacheSegment(params.userId),
      this.cacheSegment(params.extra),
    );
    const cached = await redisService.get(cacheKey);

    if (cached) {
      try {
        return JSON.parse(cached) as { posts: any[]; pagination: any };
      } catch {
        // Ignore malformed cache and read fresh data.
      }
    }

    const result = await params.resolver();
    await redisService.set(cacheKey, JSON.stringify(result), {
      EX: this.postListCacheTtlSeconds,
    });

    return result;
  }

  async getNewsFeed({
    after,
    take,
    userId,
    feedType = NewFeedType.FOR_YOU,
  }: NewsFeedPayload) {
    const where = buildNewFeedWhere({
      after,
      userId,
      feedType,
    });
    baseLogger.info(
      `Getting news feed for user ${JSON.stringify(userId)} with feed type ${JSON.stringify(feedType)}. Generated where clause: ${JSON.stringify(where)}`,
    );
    return this.getCachedPostList({
      scope: "news-feed",
      after,
      take,
      userId,
      extra: feedType,
      resolver: () =>
        this.paginatePosts({
          userId,
          after,
          take,
          where,
        }),
    });
  }

  async getPostMe({ after, take, userId }: GetPostWithUser) {
    return this.getCachedPostList({
      scope: "post-me",
      after,
      take,
      userId,
      extra: userId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          where: buildUserPostsWhere({
            after,
            userId,
            postType: PostType.POST,
          }),
          userId,
        }),
    });
  }

  async getPostsByUser({ after, take, userId }: GetPostWithUser) {
    return this.getCachedPostList({
      scope: "post-user",
      after,
      take,
      extra: userId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          where: buildUserPostsWhere({
            after,
            userId,
            postType: PostType.POST,
          }),
        }),
    });
  }

  async getRepliesByUser({ after, take, userId }: GetPostWithUser) {
    return this.getCachedPostList({
      scope: "reply-user",
      after,
      take,
      extra: userId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          where: buildUserPostsWhere({
            after,
            userId,
            postType: PostType.REPLY,
          }),
        }),
    });
  }

  async getReplies({ after, take, publicId }: GetPostWithPublicId) {
    return this.getCachedPostList({
      scope: "reply-post",
      after,
      take,
      extra: publicId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          where: buildRepliesWhere({
            after,
            publicId,
          }),
        }),
    });
  }

  async getCircleReplies({ after, take, publicId }: GetPostWithPublicId) {
    return this.getCachedPostList({
      scope: "reply-circle-post",
      after,
      take,
      extra: publicId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          where: {
            parentPublicId: publicId,
            type: PostType.CIRCLE_REPLY,
          },
        }),
    });
  }

  async getQuote({ after, take, userId }: GetPostWithUser) {
    return this.getCachedPostList({
      scope: "quote-user",
      after,
      take,
      extra: userId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          where: buildQuoteWhere({
            after,
            userId,
          }),
        }),
    });
  }

  async create(payload: CreatePostPayload) {
    const snapshot = await this.resolveUser(payload.userId);
    const options = this.resolvePostOptions(payload);
    const normalizedTopic = normalizeTopic(payload.topic);
    //Validate mentions
    const mentionIds = await this.validateMentions(payload.mentions);

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
      elasticProducer.addPostToElasticQueue({
        postId: post.id || 0,
        publicId: post.publicId,
        userId: payload.userId,
        content: post.content ?? payload.content,
        authorUsername: snapshot.username,
        authorName: snapshot.name,
        topic: normalizedTopic,
        createdAt: post.createdAt,
      }),
      userActionLogService.logPostCreated({
        userId: payload.userId,
        targetId: post.publicId,
        metadata: {
          postId: post.id ?? null,
          source: "POST",
        },
      }),
      this.dispatchMentionNotifications({
        mentionIds,
        actorId: payload.userId,
        username: snapshot.username,
        avatar: snapshot.avatar,
        targetPostId: post.publicId,
        originPostId: post.publicId,
        postOwnerId: payload.userId,
        content: payload.content,
      }),
      this.bumpPostListCacheVersion(),
    ]);
    return post;
  }

  async createCircle(payload: CreateCirclePostPayload) {
    const snapshot = await this.resolveUser(payload.userId);
    const mentionIds = await this.validateMentions(payload.mentions);
    const options = this.resolvePostOptions({
      visibility: payload.visibility ?? VisibilityPost.CIRCLE,
      replyPermission: payload.replyPermission ?? ReplyPermission.EVERYONE,
    });

    const post = await this.createInTransaction(
      (tx) =>
        postRepository.create(
          {
            ...payload,
            type: payload.type ?? PostType.CIRCLE,
            ...options,
          },
          snapshot,
          tx,
        ),
      { topic: payload.topic, mentionIds },
    );

    await pineProducer.addToPineconeQueue({
      content: payload.content,
      topic: [normalizeTopic(payload.topic) ?? "not"],
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
    await this.bumpPostListCacheVersion();
    return post;
  }

  async reply(publicId: string, payload: CreatePostDto & { userId: string }) {
    const snapshot = await this.resolveUser(payload.userId);
    const normalizedTopic = normalizeTopic(payload.topic);
    const mentionIds = await this.validateMentions(payload.mentions);
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
      this.dispatchMentionNotifications({
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
      elasticProducer.addPostToElasticQueue({
        postId: post.id || 0,
        publicId: post.publicId,
        userId: payload.userId,
        content: post.content ?? payload.content,
        authorUsername: snapshot.username,
        authorName: snapshot.name,
        topic: normalizedTopic,
        createdAt: post.createdAt,
      }),
      this.bumpPostListCacheVersion(),
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
    const mentionIds = await this.validateMentions(payload.mentions);
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
    // await notificationService.handleNewComment({

    //   actorId: payload.userId,
    //   recipientId: existPost.userId,
    //   targetPostId: post.publicId,
    //   originPostId: existPost.publicId,
    //   postOwnerId: existPost.userId,
    //   username: snapshot.username,
    // });

    await this.bumpPostListCacheVersion();
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
    await this.bumpPostListCacheVersion();
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
    const normalizedTopic = normalizeTopic(payload.topic);
    const mentionIds = await this.validateMentions(payload.mentions);
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
      elasticProducer.addPostToElasticQueue({
        postId: post.id || 0,
        publicId: post.publicId,
        userId: payload.userId,
        content: post.content ?? payload.content,
        authorUsername: snapshot.username,
        authorName: snapshot.name,
        topic: normalizedTopic,
        createdAt: post.createdAt,
      }),
      userActionLogService.logQuoteCreated({
        userId: payload.userId,
        targetId: post.publicId,
        metadata: {
          originPublicId: resolvedOriginPublicId,
          originPostId: resolvedOriginPostId,
        },
      }),
      this.dispatchMentionNotifications({
        mentionIds,
        actorId: payload.userId,
        username: snapshot.username,
        avatar: snapshot.avatar,
        targetPostId: post.publicId,
        originPostId: resolvedOriginPublicId,
        postOwnerId: originPost.userId,
        content: payload.content,
      }),
      this.bumpPostListCacheVersion(),
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

  async getById(publicId: string) {
    const post = await postRepository.findByPublicId(publicId);

    if (!post) {
      return null;
    }

    return {
      ...post,
    };
  }
  async hide(publicId: string, userId: string): Promise<void> {
    const post = await postRepository.findByPublicId(publicId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId === userId) {
      throw new Error("Users cannot hide their own posts");
    }

    await postRepository.updateIsGhost(publicId, !post.isGhost);
    await this.bumpPostListCacheVersion();
  }

  async save(publicId: string, userId: string): Promise<void> {
    // stub: no-op
    return;
  }

  private resolveDeleteActionType(postType: PostType): ActionType {
    if (postType === PostType.QUOTE) {
      return ActionType.QUOTE_DELETED;
    }

    if (postType === PostType.REPOST) {
      return ActionType.SHARE_DELETED;
    }

    return ActionType.POST_DELETED;
  }

  // Kỉ thuật lạ l cập nhập like theo pop
  async like(
    publicId: string,
    userId: string,
    isLiked: boolean,
  ): Promise<number> {
    const likeKey = redisKey.post.likesSet(publicId);
    const countKey = redisKey.post.likeCount(publicId);

    baseLogger.info(`User ${userId} is ${isLiked ? "liking" : "unliking"} post ${publicId}`);
    baseLogger.info(`Like key: ${likeKey}, Count key: ${countKey}`);

    if (isLiked) {
      const added = await redisService.sAdd(likeKey, userId);
      baseLogger.info(`Added ${added}`);
      baseLogger.info(`Added like for post ${publicId} by user ${userId}`);
      if (added === 1) {
        baseLogger.info(`Incrementing like count for post ${publicId}`);
        await redisService.incr(countKey);
        await redisService.lPush(
          QUEUE_NAME.LIKED_ADD_QUEUE,
          JSON.stringify({
            postPublicId: publicId,
            createdAt: new Date().toISOString(),
            userId,
          }),
        );
        await userActionLogService.logLikeCreated({
          userId,
          targetId: publicId,
          metadata: {
            postPublicId: publicId,
          },
        });
      }
    } else {
      const removed = await redisService.sRem(likeKey, userId);
      baseLogger.info(`Removed like for post ${publicId} by user ${userId}`);
      if (removed === 1) {
        await redisService.decr(countKey);
        baseLogger.info(`Decrementing like count for post ${publicId}`);
        await redisService.lPush(
          QUEUE_NAME.LIKED_REMOVE_QUEUE,
          JSON.stringify({
            postPublicId: publicId,
            createdAt: new Date().toISOString(),
            userId,
          }),
        );
      }
    }
    const likeCount = await redisService.sCard(likeKey);
    return likeCount;
  }

  async delete(publicId: string, userId: string): Promise<void> {
    const post = await postRepository.findDeleteTargetByPublicId(publicId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("Users can only delete their own posts");
    }

    await postRepository.softDeleteByPublicId(publicId);
    await userActionLogService.logAction({
      userId,
      type: this.resolveDeleteActionType(post.type),
      targetId: publicId,
      metadata: {
        postType: post.type,
      },
    });
    await this.bumpPostListCacheVersion();
  }

  async update(
    publicId: string,
    userId: string,
    payload: UpdatePostDto,
  ): Promise<PostRecord> {
    const post = await postRepository.findByPublicId(publicId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("Users can only update their own posts");
    }

    const updatedPost = await postRepository.updateByPublicId(publicId, payload);
    await this.bumpPostListCacheVersion();
    return updatedPost;
  }

  async report(
    publicId: string,
    payload: {
      reason: string;
      type: ReportTargetType;
      reporterId: string;
    },
  ): Promise<ReportSubmissionResult> {
    if (payload.type === ReportTargetType.USER) {
      const targetUser = await userService.findByUserId(publicId);
      if (!targetUser) {
        throw new NotFoundException("User not found");
      }

      if (targetUser.id === payload.reporterId) {
        throw new ForbiddenException("Users cannot report themselves");
      }

      const report = await reportService.create({
        reporterId: payload.reporterId,
        targetType: ReportTargetType.USER,
        targetId: targetUser.id,
        reason: payload.reason,
        status: ReportStatus.PENDING,
      });

      return {
        id: report.id,
        targetType: report.targetType,
        targetId: report.targetId,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt,
        evaluationQueued: false,
      };
    }

    const targetPost = await postRepository.findReportTargetByPublicId(publicId);
    if (!targetPost) {
      throw new NotFoundException("Post not found");
    }

    if (targetPost.userId === payload.reporterId) {
      throw new ForbiddenException("Users cannot report their own posts");
    }

    const isCirclePost = this.circlePostTypes.has(targetPost.type);
    if (payload.type === ReportTargetType.POST && isCirclePost) {
      throw new BadRequestException(
        "type post only supports non-circle posts",
      );
    }

    if (payload.type === ReportTargetType.CIRCLE && !isCirclePost) {
      throw new BadRequestException(
        "type circle only supports circle posts",
      );
    }
    const existingReport = await reportService.findExistingReport({
      reporterId: payload.reporterId,
      targetType: payload.type,
      targetId: targetPost.publicId,
    });

    if (existingReport) {
      throw new BadRequestException("You have already reported this content");
    }
    const report = await reportService.create({
      reporterId: payload.reporterId,
      targetType: payload.type,
      targetId: targetPost.publicId,
      reason: payload.reason,
      status: ReportStatus.PENDING,
    });

    await evaluationProducer.enqueueEvaluationReport({
      reportId: report.id,
      type: payload.type,
      targetPublicId: targetPost.publicId,
      targetContent: targetPost.content,
      reason: payload.reason,
      reporterId: payload.reporterId,
      reportedUserId: targetPost.userId,
    });

    return {
      id: report.id,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      evaluationQueued: true,
    };
  }
}

export const postService = new PostService();
