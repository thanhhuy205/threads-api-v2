import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@purse/redis';
import { RedisVersionService } from '@purse/redis/redis-version';
import {
  buildPostListNamespace,
  paginatePosts,
  postListCacheTtlSeconds
} from '../../../../helper';
import type { PostUserService } from '../ports/inbound/post-user.service';
import type { GetPostWithUserCommand } from '../commands/get-post-with-user.command';
import {
  POST_REPOSITORY,
  type PostRepositoryPort,
} from '../ports/outbound/persistence/post.repository.port';

@Injectable()
export class PostUserServiceImpl implements PostUserService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepositoryPort,
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
