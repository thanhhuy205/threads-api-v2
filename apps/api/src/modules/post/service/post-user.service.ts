import {
  buildPostListNamespace,
  buildUserPostsWhere,
  paginatePosts,
  postListCacheTtlSeconds,
} from "@/modules/post/helper";
import type { GetPostWithUser } from "@/modules/post/interfaces/get-post-with-user";
import { RedisVersionService } from '@/shared/redis-version';
import { RedisService } from '@libs/cache/redis.service';
import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';

@Injectable()
export class PostUserService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly redisVersionService: RedisVersionService,
    private readonly redisService: RedisService,
  ) { }
  async getPostsByUser({ after, take, userId, myUserId }: GetPostWithUser) {
    const namespace = buildPostListNamespace({
      scope: "post-user",
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
          where: { userId, parentId: null, originPostId: null },
          postRepository: this.postRepository,
          redisService: this.redisService,
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
    return this.redisVersionService.wrapperCacheVersion(
      namespace,
      postListCacheTtlSeconds,
      () =>
        paginatePosts({
          after,
          take,
          userId: myUserId,
          where: { userId, parentId: { not: null } },
          postRepository: this.postRepository,
          redisService: this.redisService,
        }),
    );
  }
}
