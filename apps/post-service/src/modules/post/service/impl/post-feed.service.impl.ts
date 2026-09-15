import { RedisService } from '@purse/core/redis';
import { RedisVersionService } from '@purse/core/redis-version';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  buildNewFeedWhere,
  buildPostListNamespace,
  buildQuoteWhere,
  buildRepliesWhere,
  paginatePosts,
  postListCacheTtlSeconds,
} from '../../helper';
import { PostMapper } from '../../mapper/post.mapper';
import type { GetPostWithPublicIdCommand } from '../../command/get-post-with-public-id.command';
import type { GetPostWithUserCommand } from '../../command/get-post-with-user.command';
import type { NewsFeedCommand } from '../../command/news-feed.command';
import { POST_REPOSITORY, type PostRepository } from "../../repository/post.repository";
import type { PostFeedService } from '../post-feed.service';

@Injectable()
export class PostFeedServiceImpl implements PostFeedService {
  private readonly logger = new Logger(PostFeedServiceImpl.name, { timestamp: true });

  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepository,
    private readonly redisVersionService: RedisVersionService,
    private readonly redisService: RedisService,
  ) { }
  async getNewsFeed({
    after,
    take,
    userId,
    type,
  }: NewsFeedCommand) {
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

  async getPostMe({ after, take, userId }: GetPostWithUserCommand) {
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

  async getReplies({ after, take, publicId, userId }: GetPostWithPublicIdCommand) {
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

  async getQuote({ after, take, userId, myUserId }: GetPostWithUserCommand) {
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

  /* MAINTENANCE: DECIDE/overview feed helpers.
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
  */
}
