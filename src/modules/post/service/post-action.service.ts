import { QUEUE_NAME } from "@/constants/queue";
import { redisKey } from "@/constants/resolve-key/redis-key";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/errors/error";
import { evaluationProducer } from "@/modules/job/evaluation-post/producer/evaluation.producer";
import { reportService } from "@/modules/report/service/report.service";
import { userActionLogService } from "@/modules/user-action-log/service/user-action-log.service";
import { userService } from "@/modules/user/service/user.service";
import { redisService } from "@/providers/redis.provider";
import { redisVersion } from "@/shared/redis-version";
import {
  ActionType,
  InteractionType,
  PostType,
  ReportStatus,
  ReportTargetType,
  VisibilityPost,
} from "@prisma/client";
import { UpdatePostDto } from "../dto/post.dto";
import { postInteractionRepository } from "../repository/post-interaction.repository";
import { PostRecord, postRepository } from "../repository/post.repository";

export type ReportSubmissionResult = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  evaluationQueued: boolean;
};

class PostActionService {
  private readonly circlePostTypes = new Set<PostType>([
    PostType.CIRCLE,
    PostType.CIRCLE_REPLY,
  ]);

  private resolveDeleteActionType(postType: PostType): ActionType {
    if (postType === PostType.QUOTE) {
      return ActionType.QUOTE_DELETED;
    }

    if (postType === PostType.REPOST) {
      return ActionType.SHARE_DELETED;
    }

    return ActionType.POST_DELETED;
  }

  async hide(
    publicId: string,
    userId: string,
    isHidden: boolean,
  ): Promise<void> {
    const post = await postRepository.findByPublicId(publicId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    if (post.visibility === VisibilityPost.CIRCLE) {
      throw new BadRequestException("Circle posts cannot be hidden");
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
      const saved = await postInteractionRepository.findByStatus({
        userId,
        postId: post.id,
        type: InteractionType.SAVE,
      });

      if (saved) {
        throw new BadRequestException(
          "You must unsave this post before hiding it",
        );
      }

      await postInteractionRepository.create(hiddenPayload);
    } else {
      const hidden = await postInteractionRepository.findByStatus(hiddenPayload);

      if (!hidden) {
        throw new BadRequestException("No hidden post found");
      }

      await postInteractionRepository.deleteByUserPostAndType(hiddenPayload);
    }

    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
  }

  async actionAdmin(publicId: string, action: {
    isHidden?: boolean;
    isDeleted?: boolean;
    isDisinformation?: boolean;
  }): Promise<void> {
    const post = await postRepository.findByPublicId(publicId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.visibility === VisibilityPost.CIRCLE) {
      throw new Error("Circle posts cannot be hidden");
    }

    await postRepository.updateStatusByPublicId(publicId, {
      ...action
    });
    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
  }

  async save(
    publicId: string,
    userId: string,
    isSaved: boolean,
  ): Promise<void> {
    const post = await postRepository.findByPublicId(publicId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const savedPayload = {
      userId,
      postId: post.id,
      type: InteractionType.SAVE,
    };

    if (isSaved) {
      await postInteractionRepository.create(savedPayload);
    } else {
      const saved = await postInteractionRepository.findByStatus(savedPayload);

      if (!saved) {
        throw new BadRequestException("No saved post found");
      }

      await postInteractionRepository.deleteByUserPostAndType(savedPayload);
    }

    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
  }

  // Kỉ thuật lạ l cập nhập like theo pop
  async like(
    publicId: string,
    userId: string,
  ): Promise<number> {
    const post = await postRepository.findByPublicId(publicId);
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
          QUEUE_NAME.POST_LIKE_EVENT_QUEUE,
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
    console.log(changed);
    const likeCount = await redisService.sCard(likeKey);

    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
    return likeCount + (post.likesCount ?? 0);
  }

  async delete(publicId: string, userId: string): Promise<void> {
    const post = await postRepository.findDeleteTargetByPublicId(publicId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("Users can only delete their own posts");
    }

    await postRepository.softDeleteByPublicId(publicId);
    await userActionLogService.logAction({
      userId,
      type: this.resolveDeleteActionType(post.type),
      targetId: publicId,
      metadata: {
        postType: post.type,
      },
    });
    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
  }

  async update(
    publicId: string,
    userId: string,
    payload: UpdatePostDto,
  ): Promise<PostRecord> {
    const post = await postRepository.findByPublicId(publicId);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("Users can only update their own posts");
    }

    const updatedPost = await postRepository.updateByPublicId(publicId, payload);
    await redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace());
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
      const targetUser = await userService.findByUserId(publicId);
      if (!targetUser) {
        throw new NotFoundException("User not found");
      }

      if (targetUser.id === payload.reporterId) {
        throw new ForbiddenException("Users cannot report themselves");
      }

      const report = await reportService.create({
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

    const targetPost = await postRepository.findReportTargetByPublicId(publicId);
    if (!targetPost) {
      throw new NotFoundException("Post not found");
    }

    if (targetPost.userId === payload.reporterId) {
      throw new ForbiddenException("Users cannot report their own posts");
    }

    const isCirclePost = this.circlePostTypes.has(targetPost.type);
    if (payload.type === ReportTargetType.POST && isCirclePost) {
      throw new BadRequestException(
        "type post only supports non-circle posts",
      );
    }

    if (payload.type === ReportTargetType.CIRCLE && !isCirclePost) {
      throw new BadRequestException(
        "type circle only supports circle posts",
      );
    }
    const existingReport = await reportService.findExistingReport({
      reporterId: payload.reporterId,
      targetType: payload.type,
      targetId: targetPost.publicId,
    });

    if (existingReport) {
      throw new BadRequestException("You have already reported this content");
    }
    const report = await reportService.create({
      reporterId: payload.reporterId,
      targetType: payload.type,
      targetId: targetPost.publicId,
      reason: payload.reason,
      status: ReportStatus.PENDING,
    });

    await evaluationProducer.enqueueEvaluationReport({
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

export const postActionService = new PostActionService();
