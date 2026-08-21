import {
  buildPostListNamespace,
  buildUserPostsWhere,
  paginatePosts,
  postListCacheTtlSeconds,
} from "@/modules/post/helper";
import { RedisVersionService } from '@/shared/redis-version';
import { RedisService } from '@libs/cache/redis.service';
import { Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY, type PostRepository } from '../../repository/post.repository';
import type { GetPostWithUserCommand } from '../../command/get-post-with-user.command';
import type { PostUserService } from '../post-user.service';

@Injectable()
export class PostUserServiceImpl implements PostUserService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepository,
    private readonly redisVersionService: RedisVersionService,
    private readonly redisService: RedisService,
  ) { }
  async getPostsByUser({ after, take, userId, myUserId }: GetPostWithUserCommand) {
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

  async getRepliesByUser({ after, take, userId, myUserId }: GetPostWithUserCommand) {
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
