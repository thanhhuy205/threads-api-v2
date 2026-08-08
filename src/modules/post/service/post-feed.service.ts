import { baseLogger } from "@/middlewares/logger";
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FollowerService } from '@/modules/user/service/follower.service';
import { NewFeedType } from "@/modules/post/enum";
import {
  buildNewFeedWhere,
  buildQuoteWhere,
  buildRepliesWhere,
  buildUserPostsWhere,
  buildPostListNamespace,
  paginatePosts,
  postListCacheTtlSeconds,
} from "@/modules/post/helper";
import type { GetPostWithPublicId } from "@/modules/post/interfaces/get-post-with-public-id";
import type { GetPostWithUser } from "@/modules/post/interfaces/get-post-with-user";
import type { NewsFeedPayload } from "@/modules/post/interfaces/news-feed-payload";
import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { RedisVersionService } from '@/shared/redis-version';
import { primaryPostTypes } from "../constants/post-type";
import { PostRepository } from "../repository/post.repository";

@Injectable()
export class PostFeedService {
  constructor(
    private readonly postRepository: PostRepository,
    @Inject(forwardRef(() => FollowerService)) private readonly followerService: FollowerService,
    private readonly redisVersionService: RedisVersionService,
  ) {}
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
    const namespace = buildPostListNamespace({
      scope: "news-feed",
      after,
      take,
      userId,
      extra: feedType,
    });
    return this.redisVersionService.wrapperCacheVersion(
      namespace,
      postListCacheTtlSeconds,
      () =>
        paginatePosts({
          userId,
          after,
          take,
          where,
          postRepository: this.postRepository,
          followerService: this.followerService,
        }),
    );
  }

  async getPostMe({ after, take, userId }: GetPostWithUser) {
    const namespace = buildPostListNamespace({
      scope: "post-me",
      after,
      take,
      userId,
      extra: userId,
    });

    return this.redisVersionService.wrapperCacheVersion(
      namespace,
      postListCacheTtlSeconds,
      () =>
        paginatePosts({
          after,
          take,
          userId,
          where: buildUserPostsWhere({
            after,
            userId,
            postTypes: primaryPostTypes,
          }),
          postRepository: this.postRepository,
          followerService: this.followerService,
        }),
    );
  }

  async getReplies({ after, take, publicId, userId }: GetPostWithPublicId) {
    const namespace = buildPostListNamespace({
      scope: "reply-post",
      after,
      take,
      userId,
      extra: publicId,
    });
    return this.redisVersionService.wrapperCacheVersion(
      namespace,
      postListCacheTtlSeconds,
      () =>
        paginatePosts({
          after,
          take,
          userId,
          where: buildRepliesWhere({
            after,
            publicId,
          }),
          postRepository: this.postRepository,
          followerService: this.followerService,
        }),
    );
  }

  async getQuote({ after, take, userId, myUserId }: GetPostWithUser) {
    const namespace = buildPostListNamespace({
      scope: "quote-user",
      after,
      take,
      userId: myUserId,
      extra: userId,
    });
    return this.redisVersionService.wrapperCacheVersion(
      namespace,
      postListCacheTtlSeconds,
      () =>
        paginatePosts({
          after,
          take,
          userId: myUserId,
          where: buildQuoteWhere({
            after,
            userId,
          }),
          postRepository: this.postRepository,
          followerService: this.followerService,
        }),
    );
  }

  async getById(publicId: string, userId?: string | null) {
    const post = await this.postRepository.findByPublicId(publicId, userId);

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      ...PostMapper.toFeedResponse(post, userId ?? undefined),
    };
  }
}
