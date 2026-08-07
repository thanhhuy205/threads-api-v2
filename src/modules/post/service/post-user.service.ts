import {
  buildUserPostsWhere,
  buildPostListNamespace,
  paginatePosts,
  postListCacheTtlSeconds,
} from "@/modules/post/helper";
import { Injectable } from '@nestjs/common';
import type { GetPostWithUser } from "@/modules/post/interfaces/get-post-with-user";
import { redisVersion } from "@/shared/redis-version";
import { forwardRef, Inject } from '@nestjs/common';
import { FollowerService } from '@/modules/user/service/follower.service';
import { PostRepository } from '../repository/post.repository';
import { PostType } from "@prisma/client";
import { primaryPostTypes } from "../constants/post-type";

@Injectable()
export class PostUserService {
  constructor(
    private readonly postRepository: PostRepository,
    @Inject(forwardRef(() => FollowerService)) private readonly followerService: FollowerService,
  ) {}
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
            postTypes: primaryPostTypes,
          }),
          postRepository: this.postRepository,
          followerService: this.followerService,
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
            postTypes: [PostType.REPLY],
          }),
          postRepository: this.postRepository,
          followerService: this.followerService,
        }),
    );
  }
}
