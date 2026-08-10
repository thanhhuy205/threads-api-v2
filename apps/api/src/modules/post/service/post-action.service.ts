import { QUEUE_NAME } from "@/constants/queue";
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { redisKey } from "@/constants/resolve-key/redis-key";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/errors/error";
import { EvaluationProducer } from "@/modules/job/evaluation-post/producer/evaluation.producer";
import { ReportService } from "@/modules/report/service/report.service";
import { UserService } from "@/modules/user/service/user.service";
import { redisService } from "@/providers/redis.provider";
import { RedisVersionService } from '@/shared/redis-version';
import {
  InteractionType,
  ReportStatus,
  ReportTargetType,
  VisibilityPost,
} from "@prisma/client";
import { UpdatePostDto } from "../dto/post.dto";
import { PostInteractionRepository } from "../repository/post-interaction.repository";
import { PostRecord, PostRepository } from "../repository/post.repository";

export type ReportSubmissionResult = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  evaluationQueued: boolean;
};

@Injectable()
export class PostActionService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postInteractionRepository: PostInteractionRepository,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly reportService: ReportService,
    private readonly redisVersionService: RedisVersionService,
    private readonly evaluationProducer: EvaluationProducer,
  ) {}
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
    const changed = await redisService.eval(
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
    const likeCount = await redisService.get(countKey);
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

    const updatedPost = await this.postRepository.updateByPublicId(publicId, payload);
    await this.redisVersionService.bumpPostListCacheVersion(redisKey.post.listNamespace());
    return updatedPost;
  }

  async report(
    publicId: string,
    payload: {
      reason: string;
      type: ReportTargetType;
      reporterId: string;
    },
  ): Promise<ReportSubmissionResult> {
    if (payload.type === ReportTargetType.USER) {
      const targetUser = await this.userService.findByUserId(publicId);
      if (!targetUser) {
        throw new NotFoundException("User not found");
      }

      if (targetUser.id === payload.reporterId) {
        throw new ForbiddenException("Users cannot report themselves");
      }

      const report = await this.reportService.create({
        reporterId: payload.reporterId,
        targetType: ReportTargetType.USER,
        targetId: targetUser.id,
        reason: payload.reason,
        status: ReportStatus.PENDING,
      });

      return {
        id: report.id,
        targetType: report.targetType,
        targetId: report.targetId,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt,
        evaluationQueued: false,
      };
    }

    const targetPost = await this.postRepository.findReportTargetByPublicId(publicId);
    if (!targetPost) {
      throw new NotFoundException("Post not found");
    }

    if (targetPost.userId === payload.reporterId) {
      throw new ForbiddenException("Users cannot report their own posts");
    }

    const existingReport = await this.reportService.findExistingReport({
      reporterId: payload.reporterId,
      targetType: payload.type,
      targetId: targetPost.publicId,
    });

    if (existingReport) {
      throw new BadRequestException("You have already reported this content");
    }
    const report = await this.reportService.create({
      reporterId: payload.reporterId,
      targetType: payload.type,
      targetId: targetPost.publicId,
      reason: payload.reason,
      status: ReportStatus.PENDING,
    });

    await this.evaluationProducer.enqueueEvaluationReport({
      reportId: report.id,
      type: payload.type,
      targetPublicId: targetPost.publicId,
      targetContent: targetPost.content,
      reason: payload.reason,
      reporterId: payload.reporterId,
      reportedUserId: targetPost.userId,
    });

    return {
      id: report.id,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      evaluationQueued: true,
    };
  }
}
