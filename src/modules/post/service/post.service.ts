import { QUEUE_NAME } from "@/constants/queue";
import { redisKey } from "@/constants/resolve-key/redis-key";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { pineProducer } from "@/modules/job/pine-vector/producer/pine.producer";
import { mixedBreadService } from "@/modules/mixed-bread/service/mixed-bread.service";
import { pineconeService } from "@/modules/pinecone/service/pinecone.service";
import { NewFeedType } from "@/modules/post/enum";
import {
  buildNewFeedWhere,
  buildQuoteWhere,
  buildRepliesWhere,
  buildUserPostsWhere,
} from "@/modules/post/helper";
import type { CreatePostPayload } from "@/modules/post/interfaces/create-post-payload";
import type { GetPostWithPublicId } from "@/modules/post/interfaces/get-post-with-public-id";
import type { GetPostWithUser } from "@/modules/post/interfaces/get-post-with-user";
import type { NewsFeedPayload } from "@/modules/post/interfaces/news-feed-payload";
import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { userService } from "@/modules/user/service/user.service";
import { redisService } from "@/providers/redis.provider";
import {
  buildCursorPagination,
  buildPagination,
} from "@/shared/pagination/cursor-pagination";
import { transactionService } from "@/shared/transaction/transaction.service";
import {
  PostType,
  Prisma,
  ReplyPermission,
  VisibilityPost,
} from "@prisma/client";
import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import { normalizeTopic } from "../helper/nomalize.hepler";
import { PostRecord, postRepository } from "../repository/post.repository";
import { topicsPostRepository } from "../repository/topics-post.repository";

class PostService {
  private resolveReplyPermission(replyPermission?: string): ReplyPermission {
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

  private resolveVisibility(visibility?: string): VisibilityPost {
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
    const post = await postRepository.findByPublicId(publicId);
    if (!post) throw new NotFoundException("Origin post not found");
    return post;
  }

  private resolvePostOptions(payload: CreatePostDto) {
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
    mentions?: CreatePostDto["mentions"],
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

    const rows = posts.map((post) =>
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
    return this.paginatePosts({
      userId,
      after,
      take,
      where,
    });
  }

  async getPostMe({ after, take, userId }: GetPostWithUser) {
    return this.paginatePosts({
      after,
      take,
      where: buildUserPostsWhere({
        after,
        userId,
        postType: PostType.POST,
      }),
      userId,
    });
  }

  async getPostsByUser({ after, take, userId }: GetPostWithUser) {
    return this.paginatePosts({
      after,
      take,
      where: buildUserPostsWhere({
        after,
        userId,
        postType: PostType.POST,
      }),
    });
  }

  async getRepliesByUser({ after, take, userId }: GetPostWithUser) {
    return this.paginatePosts({
      after,
      take,
      where: buildUserPostsWhere({
        after,
        userId,
        postType: PostType.REPLY,
      }),
    });
  }

  async getReplies({ after, take, publicId }: GetPostWithPublicId) {
    return this.paginatePosts({
      after,
      take,
      where: buildRepliesWhere({
        after,
        publicId,
      }),
    });
  }

  async getQuote({ after, take, userId }: GetPostWithUser) {
    return this.paginatePosts({
      after,
      take,
      where: buildQuoteWhere({
        after,
        userId,
      }),
    });
  }

  async create(payload: CreatePostPayload) {
    const snapshot = await this.resolveUser(payload.userId);
    //Validate mentions
    const mentionIds = await this.validateMentions(payload.mentions);

    // Create post and attach meta in a transaction
    const post = await this.createInTransaction(
      (tx) => postRepository.create(payload, snapshot, tx),
      { topic: payload.topic, mentionIds },
    );

    await pineProducer.addToPineconeQueue({
      content: payload.content,
      topic: [normalizeTopic(payload.topic) ?? "not"],
      postId: post.id || 0,
      userId: payload.userId,
    });
    return post;
  }

  async reply(publicId: string, payload: CreatePostDto & { userId: string }) {
    const snapshot = await this.resolveUser(payload.userId);
    const mentionIds = await this.validateMentions(payload.mentions);
    const options = this.resolvePostOptions(payload);

    const post = await this.createInTransaction(
      (tx) =>
        postRepository.createReply(
          { ...payload, ...options },
          publicId,
          snapshot,
          tx,
        ),
      { topic: payload.topic, mentionIds },
    );
    return {
      publicId: post.publicId,
      content: post.content!,
      userId: post.userId,
      visibility: post.visibility,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async repost(payload: CreatePostDto & { publicId: string }, userId: string) {
    const snapshot = await this.resolveUser(userId);
    const originPost = await this.resolveOriginPost(payload.publicId);
    const options = this.resolvePostOptions(payload);

    const post = await postRepository.createRepost(
      { userId, content: payload.content, ...options },
      payload.publicId,
      snapshot,
      originPost.id,
    );

    return {
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      visibility: post.visibility,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async quote(publicId: string, payload: CreatePostDto & { userId: string }) {
    const snapshot = await this.resolveUser(payload.userId);
    const originPost = await this.resolveOriginPost(publicId);
    const mentionIds = await this.validateMentions(payload.mentions);
    const options = this.resolvePostOptions(payload);

    const post = await this.createInTransaction(
      (tx) =>
        postRepository.createQuote(
          { ...payload, ...options },
          publicId,
          snapshot,
          originPost.id,
          tx,
        ),
      { topic: payload.topic, mentionIds },
    );

    return {
      publicId: post.publicId,
      content: post.content,
      userId: payload.userId,
      visibility: post.visibility,
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
  }

  async save(publicId: string, userId: string): Promise<void> {
    // stub: no-op
    return;
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
    const post = await postRepository.findByPublicId(publicId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("Users can only delete their own posts");
    }

    await postRepository.softDeleteByPublicId(publicId);
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

    return postRepository.updateByPublicId(publicId, payload);
  }

  async report(
    publicId: string,
    payload: { reason: string; userId: string },
  ): Promise<void> {
    // stub: no-op
    return;
  }
}

export const postService = new PostService();
