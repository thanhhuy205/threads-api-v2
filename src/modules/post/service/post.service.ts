import { QUEUE_NAME } from "@/constants/queue";
import { redisKey } from "@/constants/resolve-key/redis-key";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
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
  CreatePostPayload
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
  InteractionType,
  PostType,
  Prisma,
  ReplyPermission,
  ReportStatus,
  ReportTargetType,
  VisibilityPost,
} from "@prisma/client";
import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import { normalizeTopic } from "../helper/nomalize.hepler";
import { postInteractionRepository } from "../repository/post-interaction.repository";
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

type CreatePostMeta = {
  topic?: string;
  mentionIds: string[];
};

class PostService {
  private readonly postListCacheTtlSeconds = 60;
  private readonly similarPostsCacheTtlSeconds = 300;
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
    meta?: CreatePostMeta,
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
    payload?: CreatePostMeta,
  ): Promise<void> {
    if (!payload) return;
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

    // Poll
    const mapPostIdToPollId = new Map<string, number>();
    const voteCountMap = new Map<number, any>()
    posts.forEach((post) => {
      if (post.isSurvey && post.poll?.id) {
        mapPostIdToPollId.set(post.publicId, post.poll.id);
      }
    });
    console.log("mapPostIdToPollId", mapPostIdToPollId)

    if (mapPostIdToPollId.size > 0) {
      const pollIds = Array.from(mapPostIdToPollId.values())
      const keys = pollIds.map(id => redisKey.poll.countVote(id))
      const voteCountAll = await redisService.mGet(keys);
      console.log(voteCountAll);
      pollIds.forEach((pollId, index) => {
        if (voteCountAll[index] !== null) {
          voteCountMap.set(pollId, JSON.parse(voteCountAll[index]))
        }
      })
    }

    console.log(voteCountMap)
    const data = posts.map((post) => ({
      ...post,
      isFollowingAuthor: followingSet.has(post.userId),
      isFollowedByAuthor: followerSet.has(post.userId),
      poll: post?.poll && mapPostIdToPollId.has(post.publicId) ? {
        ...post.poll,
        voteCount: voteCountMap.get(post?.poll.id) ?? post.poll?.voteCount ?? 0,
      } : null
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
          userId,
          where: buildUserPostsWhere({
            after,
            userId,
            postType: PostType.POST,
          }),
        }),
    });
  }

  async getPostsByUser({ after, take, userId, myUserId }: GetPostWithUser) {
    return this.getCachedPostList({
      scope: "post-user",
      after,
      take,
      userId: myUserId,
      extra: userId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          userId: myUserId,
          where: buildUserPostsWhere({
            after,
            userId,
            postType: PostType.POST,
          }),
        }),
    });
  }

  async getRepliesByUser({ after, take, userId, myUserId }: GetPostWithUser) {
    return this.getCachedPostList({
      scope: "reply-user",
      after,
      take,
      userId: myUserId,
      extra: userId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          userId: myUserId,
          where: buildUserPostsWhere({
            after,
            userId,
            postType: PostType.REPLY,
          }),
        }),
    });
  }

  async getReplies({ after, take, publicId, userId }: GetPostWithPublicId) {
    return this.getCachedPostList({
      scope: "reply-post",
      after,
      take,
      userId,
      extra: publicId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          userId,
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

  async getQuote({ after, take, userId, myUserId }: GetPostWithUser) {
    return this.getCachedPostList({
      scope: "quote-user",
      after,
      take,
      userId: myUserId,
      extra: userId,
      resolver: () =>
        this.paginatePosts({
          after,
          take,
          userId: myUserId,
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

    await this.bumpPostListCacheVersion();
    return post;
  }

  async reply(publicId: string, payload: CreatePostDto & { userId: string }) {
    const snapshot = await this.resolveUser(payload.userId);
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

  async count(userId: string) {
    return postRepository.countPostBydUserId(userId);
  }

  async getById(publicId: string, userId?: string | null) {
    const post = await postRepository.findByPublicId(publicId, userId);

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      ...PostMapper.toFeedResponse(post, userId ?? undefined),
    };
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

  async hide(
    publicId: string,
    userId: string,
    isHidden: boolean,
  ): Promise<void> {
    const post = await postRepository.findByPublicId(publicId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    if (post.visibility === VisibilityPost.CIRCLE) {
      throw new BadRequestException("Circle posts cannot be hidden");
    }
    if (post.userId === userId) {
      throw new ForbiddenException("Users cannot hide their own posts");
    }

    const hiddenPayload = {
      userId,
      postId: post.id,
      type: InteractionType.HIDE,
    };

    if (isHidden) {
      const saved = await postInteractionRepository.findByStatus({
        userId,
        postId: post.id,
        type: InteractionType.SAVE,
      });

      if (saved) {
        throw new BadRequestException(
          "You must unsave this post before hiding it",
        );
      }

      await postInteractionRepository.create(hiddenPayload);
    } else {
      const hidden = await postInteractionRepository.findByStatus(hiddenPayload);

      if (!hidden) {
        throw new BadRequestException("No hidden post found");
      }

      await postInteractionRepository.deleteByUserPostAndType(hiddenPayload);
    }

    await this.bumpPostListCacheVersion();
  }

  async actionAdmin(publicId: string, action: {
    isHidden?: boolean;
    isDeleted?: boolean;
    isDisinformation?: boolean;
  }): Promise<void> {
    const post = await postRepository.findByPublicId(publicId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.visibility === VisibilityPost.CIRCLE) {
      throw new Error("Circle posts cannot be hidden");
    }

    await postRepository.updateStatusByPublicId(publicId, {
      ...action
    });
    await this.bumpPostListCacheVersion();
  }

  async save(
    publicId: string,
    userId: string,
    isSaved: boolean,
  ): Promise<void> {
    const post = await postRepository.findByPublicId(publicId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const savedPayload = {
      userId,
      postId: post.id,
      type: InteractionType.SAVE,
    };

    if (isSaved) {
      await postInteractionRepository.create(savedPayload);
    } else {
      const saved = await postInteractionRepository.findByStatus(savedPayload);

      if (!saved) {
        throw new BadRequestException("No saved post found");
      }

      await postInteractionRepository.deleteByUserPostAndType(savedPayload);
    }

    await this.bumpPostListCacheVersion();
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

    const event = JSON.stringify({
      postPublicId: publicId,
      createdAt: new Date().toISOString(),
      userId,
      isLiked,
    });
    const changed = await redisService.eval(
      `
        local changed
        if ARGV[2] == "1" then
          changed = redis.call("SADD", KEYS[1], ARGV[1])
          if changed == 1 then
            redis.call("INCR", KEYS[2])
          end
        else
          changed = redis.call("SREM", KEYS[1], ARGV[1])
          if changed == 1 then
            redis.call("DECR", KEYS[2])
          end
        end

        if changed == 1 then
          redis.call("LPUSH", KEYS[3], ARGV[3])
        end

        return changed
      `,
      {
        keys: [likeKey, countKey, QUEUE_NAME.POST_LIKE_EVENT_QUEUE],
        arguments: [userId, isLiked ? "1" : "0", event],
      },
    );

    baseLogger.info({
      changed,
      isLiked,
      postPublicId: publicId,
      userId,
    }, "Updated like state and enqueued event");

    if (changed === 1 && isLiked) {
      await userActionLogService.logLikeCreated({
        userId,
        targetId: publicId,
        metadata: {
          postPublicId: publicId,
        },
      });
    }
    const likeCount = await redisService.sCard(likeKey);
    const post = await postRepository.findByPublicId(publicId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    await this.bumpPostListCacheVersion();
    return likeCount + (post.likesCount ?? 0);
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
