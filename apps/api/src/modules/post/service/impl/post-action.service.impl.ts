import { QUEUE_NAME } from "@/constants/queue";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/errors/error";
import { ABILITY_SERVICE, type AbilityService } from '@/modules/ability/service/ability.service';
import { RedisVersionService } from '@/shared/redis-version';
import { RedisService } from "@libs/cache/redis.service";
import { PERMISSIONS } from '@libs/common/src/constants/permission.constant';
import { redisKey } from "@libs/core/constants/redis-key";
import { Inject, Injectable } from '@nestjs/common';
import {
  InteractionType,
  PermissionScope,
  VisibilityPost,
} from "../../../../../generated/prisma";
import { UpdatePostDto } from '../../dto/request';
import { POST_INTERACTION_REPOSITORY, type PostInteractionRepository } from "../../repository/post-interaction.repository";
import { POST_REPOSITORY, type PostRecord, type PostRepository } from "../../repository/post.repository";
import type { PostActionService } from '../post-action.service';

@Injectable()
export class PostActionServiceImpl implements PostActionService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepository,
    @Inject(POST_INTERACTION_REPOSITORY) private readonly postInteractionRepository: PostInteractionRepository,
    private readonly redisVersionService: RedisVersionService,
    private readonly redisService: RedisService,
    @Inject(ABILITY_SERVICE) private readonly abilityService: AbilityService,
  ) { }
  async hide(
    publicId: string,
    userId: string,
    isHidden: boolean,
  ): Promise<void> {
    const post = await this.postRepository.findByPublicId(publicId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    if (post.userId === userId) {
      throw new ForbiddenException("Users cannot hide their own posts");
    }

    const hiddenPayload = {
      userId,
      postId: post.id,
      type: InteractionType.HIDE,
    };

    if (isHidden) {
      const saved = await this.postInteractionRepository.findByStatus({
        userId,
        postId: post.id,
        type: InteractionType.SAVE,
      });

      if (saved) {
        throw new BadRequestException(
          "You must unsave this post before hiding it",
        );
      }

      await this.postInteractionRepository.create(hiddenPayload);
    } else {
      const hidden = await this.postInteractionRepository.findByStatus(hiddenPayload);

      if (!hidden) {
        throw new BadRequestException("No hidden post found");
      }

      await this.postInteractionRepository.deleteByUserPostAndType(hiddenPayload);
    }

    await this.redisVersionService.bumpPostListCacheVersion(redisKey.post.listNamespace());
  }

  async actionAdmin(publicId: string): Promise<void> {
    const post = await this.postRepository.findByPublicId(publicId);
    if (!post) {
      throw new Error("Post not found");
    }

    await this.postRepository.softDeleteByPublicId(publicId);
    await this.redisVersionService.bumpPostListCacheVersion(redisKey.post.listNamespace());
  }

  async save(
    publicId: string,
    userId: string,
    isSaved: boolean,
  ): Promise<void> {
    const post = await this.postRepository.findByPublicId(publicId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const savedPayload = {
      userId,
      postId: post.id,
      type: InteractionType.SAVE,
    };

    if (isSaved) {
      await this.postInteractionRepository.create(savedPayload);
    } else {
      const saved = await this.postInteractionRepository.findByStatus(savedPayload);

      if (!saved) {
        throw new BadRequestException("No saved post found");
      }

      await this.postInteractionRepository.deleteByUserPostAndType(savedPayload);
    }

    await this.redisVersionService.bumpPostListCacheVersion(redisKey.post.listNamespace());
  }

  async like(
    publicId: string,
    userId: string,
  ): Promise<number> {
    const post = await this.postRepository.findExisting(publicId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    const likeKey = redisKey.post.likesSet(publicId);
    const countKey = redisKey.post.likeCount(publicId);
    const changed = await this.redisService.redis.eval(
      `
    local changed = redis.call("SADD", KEYS[1], ARGV[1])

    if changed == 1 then
      redis.call("INCR", KEYS[2])
      redis.call("LPUSH", KEYS[3], ARGV[2])  -- isLiked: true
    else
      redis.call("SREM", KEYS[1], ARGV[1])
      redis.call("DECR", KEYS[2])
      redis.call("LPUSH", KEYS[3], ARGV[3])  -- isLiked: false
    end

    return changed
  `,
      {
        keys: [
          likeKey,
          countKey,
          String(QUEUE_NAME.POST_LIKE_EVENT_QUEUE),
        ],
        arguments: [
          userId,
          JSON.stringify({
            postPublicId: publicId,
            userId,
            isLiked: true,
            createdAt: new Date().toISOString(),
          }),
          JSON.stringify({
            postPublicId: publicId,
            userId,
            isLiked: false,
            createdAt: new Date().toISOString(),
          }),
        ],
      },
    );
    const likeCount = await this.redisService.redis.get(countKey);
    await this.redisVersionService.bumpPostListCacheVersion(redisKey.post.listNamespace());
    return Number(likeCount) ?? 0 + (post.likesCount ?? 0);
  }

  async delete(publicId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findDeleteTargetByPublicId(publicId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("Users can only delete their own posts");
    }

    await this.postRepository.softDeleteByPublicId(publicId);
    await this.redisVersionService.bumpPostListCacheVersion(redisKey.post.listNamespace());
  }

  async update(
    publicId: string,
    userId: string,
    payload: UpdatePostDto,
  ): Promise<PostRecord> {
    const post = await this.postRepository.findByPublicId(publicId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("Users can only update their own posts");
    }

    const scope =
      post.visibility === VisibilityPost.GROUP
        ? PermissionScope.GROUP
        : PermissionScope.WORKSPACE;

    if (payload.isPinned !== undefined) {
      await this.abilityService.assertCan(
        userId,
        PERMISSIONS.POST_PIN,
        scope,
      );
    }

    if (
      payload.dateRangeFrom !== undefined ||
      payload.dateRangeTo !== undefined ||
      payload.scheduledTimeFrom !== undefined ||
      payload.scheduledTimeTo !== undefined
    ) {
      if (
        payload.dateRangeFrom !== undefined &&
        payload.dateRangeFrom !== null &&
        payload.dateRangeFrom.getTime() <= Date.now()
      ) {
        throw new BadRequestException('dateRangeFrom must be in the future');
      }
      await this.abilityService.assertCan(
        userId,
        PERMISSIONS.POST_EXPIRE,
        scope,
      );
    }

    const updatedPost = await this.postRepository.updateByPublicId(publicId, payload);
    await this.redisVersionService.bumpPostListCacheVersion(redisKey.post.listNamespace());
    return updatedPost;
  }

}
