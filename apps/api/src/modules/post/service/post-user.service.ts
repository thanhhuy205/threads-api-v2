import {
  buildPostListNamespace,
  buildUserPostsWhere,
  paginatePosts,
  postListCacheTtlSeconds,
} from "@/modules/post/helper";
import type { GetPostWithUser } from "@/modules/post/interfaces/get-post-with-user";
import { FollowerService } from '@/modules/user/service/follower.service';
import { RedisVersionService } from '@/shared/redis-version';
import { RedisService } from '@libs/cache/redis.service';
import { Injectable } from '@nestjs/common';
import { PostType } from "@prisma/client";
import { primaryPostTypes } from "../constants/post-type";
import { PostRepository } from '../repository/post.repository';

@Injectable()
export class PostUserService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly followerService: FollowerService,
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
          where: buildUserPostsWhere({
            after,
            userId,
            postTypes: primaryPostTypes,
          }),
          postRepository: this.postRepository,
          followerService: this.followerService,
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
          where: buildUserPostsWhere({
            after,
            userId,
            postTypes: [PostType.REPLY],
          }),
          postRepository: this.postRepository,
          followerService: this.followerService,
          redisService: this.redisService,
        }),
    );
  }
}
