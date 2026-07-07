import { baseLogger } from "@/middlewares/logger";
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
import { redisVersion } from "@/shared/redis-version";
import { PostType } from "@prisma/client";
import { postRepository } from "../repository/post.repository";

class PostFeedService {
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
    return redisVersion.wrapperCacheVersion(
      namespace,
      postListCacheTtlSeconds,
      () =>
        paginatePosts({
          userId,
          after,
          take,
          where,
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

    return redisVersion.wrapperCacheVersion(
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
            postType: PostType.POST,
          }),
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
    return redisVersion.wrapperCacheVersion(
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
        }),
    );
  }

  async getCircleReplies({ after, take, publicId }: GetPostWithPublicId) {
    const namespace = buildPostListNamespace({
      scope: "reply-circle-post",
      after,
      take,
      extra: publicId,
    });
    return redisVersion.wrapperCacheVersion(
      namespace,
      postListCacheTtlSeconds,
      () =>
        paginatePosts({
          after,
          take,
          where: {
            parentPublicId: publicId,
            type: PostType.CIRCLE_REPLY,
          },
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
    return redisVersion.wrapperCacheVersion(
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
        }),
    );
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
}

export const postFeedService = new PostFeedService();
