import {
  buildNewFeedWhere,
  buildPostListNamespace,
  buildQuoteWhere,
  buildRepliesWhere,
  paginatePosts,
  postListCacheTtlSeconds,
} from "@/modules/post/helper";
import type { GetPostWithPublicId } from "@/modules/post/interfaces/get-post-with-public-id";
import type { GetPostWithUser } from "@/modules/post/interfaces/get-post-with-user";
import type { NewsFeedPayload } from "@/modules/post/interfaces/news-feed-payload";
import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { RedisVersionService } from '@/shared/redis-version';
import { RedisService } from '@libs/cache/redis.service';
import { Injectable, Logger } from '@nestjs/common';
import { PostRepository } from "../repository/post.repository";

@Injectable()
export class PostFeedService {
  private readonly logger = new Logger(PostFeedService.name, { timestamp: true });

  constructor(
    private readonly postRepository: PostRepository,
    private readonly redisVersionService: RedisVersionService,
    private readonly redisService: RedisService,
  ) { }
  async getNewsFeed({
    after,
    take,
    userId,
    type,
  }: NewsFeedPayload) {
    const where = buildNewFeedWhere();
    this.logger.log(
      `Getting news feed for user ${JSON.stringify(userId)}. Generated where clause: ${JSON.stringify(where)}`,
    );

    return paginatePosts({
      userId,
      after,
      take,
      where,
      postRepository: this.postRepository,
      redisService: this.redisService,
    });
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
          where: { userId, parentId: null, originPostId: null },
          postRepository: this.postRepository,
          redisService: this.redisService,
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
          redisService: this.redisService,
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
          redisService: this.redisService,
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


  findFirstReplyByPostPublicId(count: number, publicId: string) {
    return this.postRepository.findFirstRepliesByPostPublicId(count, publicId);
  }

  findLimitReplyInByPostIds(postIds: number[], limit: number) {
    return this.postRepository.findLimitReplyInByPostIds(postIds, limit);
  }

  findPostDecideWithinWeekByIds(postIds: number[]) {
    return this.postRepository.findPostDecideWithinWeekByIds(postIds);
  }

  findManyInWeek() {
    return this.postRepository.findManyInWeek();
  }

  countOverviewDeclineByPostId(postIds: number[]) {
    return this.postRepository.countOverviewDeclineByPostId(postIds);
  }

  updateManyDecideStatus(postIds: number[], isDecline: boolean) {
    return this.postRepository.updateManyDecideStatus(postIds, isDecline);
  }
}
