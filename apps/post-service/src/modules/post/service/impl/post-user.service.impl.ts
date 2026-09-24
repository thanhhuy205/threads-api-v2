import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@purse/core/redis';
import { RedisVersionService } from '@purse/core/redis-version';
import {
  buildPostListNamespace,
  paginatePosts,
  postListCacheTtlSeconds
} from '../../../../helper';
import type { GetPostWithUserCommand } from '../../application/commands/get-post-with-user.command';
import { POST_REPOSITORY, type PostRepository } from '../../application/ports/inbound/post.repository';
import type { PostUserService } from '../../application/use-cases/post-user.service';

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
