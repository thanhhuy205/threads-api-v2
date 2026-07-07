import {
  buildUserPostsWhere,
  buildPostListNamespace,
  paginatePosts,
  postListCacheTtlSeconds,
} from "@/modules/post/helper";
import type { GetPostWithUser } from "@/modules/post/interfaces/get-post-with-user";
import { redisVersion } from "@/shared/redis-version";
import { PostType } from "@prisma/client";

class PostUserService {
  async getPostsByUser({ after, take, userId, myUserId }: GetPostWithUser) {
    const namespace = buildPostListNamespace({
      scope: "post-user",
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
          where: buildUserPostsWhere({
            after,
            userId,
            postType: PostType.POST,
          }),
        }),
    );
  }

  async getRepliesByUser({ after, take, userId, myUserId }: GetPostWithUser) {
    const namespace = buildPostListNamespace({
      scope: "reply-user",
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
          where: buildUserPostsWhere({
            after,
            userId,
            postType: PostType.REPLY,
          }),
        }),
    );
  }
}

export const postUserService = new PostUserService();
