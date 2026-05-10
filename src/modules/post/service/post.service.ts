import { QUEUE_NAME } from "@/constants/queue";
import prisma from "@/config/prisma";
import { BadRequestException } from "@/errors/error";
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
import { buildCursorPagination, buildPagination } from "@/shared/pagination/cursor-pagination";
import { PostType, Prisma } from "@prisma/client";
import { CreatePostDto } from "../dto/post.dto";
import { PostRecord, postRepository } from "../repository/post.repository";
import { topicsPostRepository } from "../repository/topics-post.repository";

type PostCursorInfo = {
  id: number;
  createdAt: Date;
};

class PostService {
  private normalizeTopic(topic?: string): string | undefined {
    if (!topic) {
      return undefined;
    }

    const normalized = topic.trim().replace(/\s+/g, " ").toLowerCase();
    return normalized || undefined;
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
      throw new BadRequestException("Mentions must not contain duplicate users");
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

    const normalizedTopic = this.normalizeTopic(payload.topic);

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
    const userSnapshot = await userService.findByUserId(payload.userId);

    if (!userSnapshot) {
      throw new Error("User not found");
    }
    const mappedSnapshot = PostMapper.toUserSnapshot(userSnapshot);
    const mentionIds = await this.validateMentions(payload.mentions);
    const post = await prisma.$transaction(async (tx) => {
      const createdPost = await postRepository.create(payload, mappedSnapshot, tx);

      if (!createdPost.id) {
        throw new BadRequestException("Failed to create post");
      }

      await this.attachPostMeta(tx, createdPost.id, {
        topic: payload.topic,
        mentionIds,
      });
      return createdPost;
    });
    await pineProducer.addToPineconeQueue({
      content: payload.content,
      topic: [this.normalizeTopic(payload.topic) ?? "not"],
      postId: post.id || 0,
      userId: payload.userId,
    });
    return post;
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

  async reply(publicId: string, payload: CreatePostDto & { userId: string }) {
    const userSnapshot = await userService.findByUserId(payload.userId);

    if (!userSnapshot) {
      throw new Error("User not found");
    }

    const mappedSnapshot = PostMapper.toUserSnapshot(userSnapshot);
    const mentionIds = await this.validateMentions(payload.mentions);
    const post = await prisma.$transaction(async (tx) => {
      const createdPost = await postRepository.createReply(
        {
          content: payload.content,
          userId: payload.userId,
          media: payload.media,
          mentions: payload.mentions,
          topic: payload.topic,
        },
        publicId,
        mappedSnapshot,
        tx,
      );

      if (!createdPost.id) {
        throw new BadRequestException("Failed to create reply");
      }

      await this.attachPostMeta(tx, createdPost.id, {
        topic: payload.topic,
        mentionIds,
      });
      return createdPost;
    });

    return {
      publicId: post.publicId,
      content: post.content!,
      userId: post.userId,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async repost(payload: CreatePostDto & { publicId: string }, userId: string) {
    const userSnapshot = await userService.findByUserId(userId);

    if (!userSnapshot) {
      throw new Error("User not found");
    }

    const originPost = await postRepository.findByPublicId(payload.publicId);

    if (!originPost) {
      throw new Error("Origin post not found");
    }

    const mappedSnapshot = PostMapper.toUserSnapshot(userSnapshot);
    const post = await postRepository.createRepost(
      {
        userId,
        content: payload.content,
      },
      payload.publicId,
      mappedSnapshot,
      originPost.id,
    );

    return {
      publicId: post.publicId,
      userId: post.userId,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async quote(publicId: string, payload: CreatePostDto & { userId: string }) {
    const userSnapshot = await userService.findByUserId(payload.userId);

    if (!userSnapshot) {
      throw new Error("User not found");
    }

    const originPost = await postRepository.findByPublicId(publicId);

    if (!originPost) {
      throw new Error("Origin post not found");
    }

    const mappedSnapshot = PostMapper.toUserSnapshot(userSnapshot);
    const mentionIds = await this.validateMentions(payload.mentions);
    const post = await prisma.$transaction(async (tx) => {
      const createdPost = await postRepository.createQuote(
        {
          userId: payload.userId,
          content: payload.content,
          media: payload.media,
          mentions: payload.mentions,
          topic: payload.topic,
        },
        publicId,
        mappedSnapshot,
        originPost.id,
        tx,
      );

      if (!createdPost.id) {
        throw new BadRequestException("Failed to create quote");
      }

      await this.attachPostMeta(tx, createdPost.id, {
        topic: payload.topic,
        mentionIds,
      });
      return createdPost;
    });

    return {
      publicId: post.publicId,
      content: post.content,
      userId: payload.userId,
      createdAt: new Date().toISOString(),
    } as PostRecord;
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
    const likeKey = `post:${publicId}:likes`;
    const countKey = `post:${publicId}:likeCount`;

    if (isLiked) {
      const added = await redisService.sAdd(likeKey, userId);
      baseLogger.info(`Added like for post ${publicId} by user ${userId}`);
      if (added === 1) {
        await redisService.incr(countKey);
        await redisService.lPush(
          QUEUE_NAME.LIKED_ADD_QUEUE,
          JSON.stringify({ postPublicId: publicId, createdAt: new Date().toISOString(), userId }),
        );
      }
    } else {
      const removed = await redisService.sRem(likeKey, userId);
      baseLogger.info(`Removed like for post ${publicId} by user ${userId}`);
      if (removed === 1) {
        await redisService.decr(countKey);
        await redisService.lPush(
          QUEUE_NAME.LIKED_REMOVE_QUEUE,
          JSON.stringify({ postPublicId: publicId, createdAt: new Date().toISOString(), userId }),
        );
      }
    }
    const likeCount = await redisService.sCard(likeKey);
    return likeCount
  }

  async delete(publicId: string, userId: string): Promise<void> {
    // stub: no-op
    return;
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
