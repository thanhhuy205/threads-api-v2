import { NOTIFICATION_JOB_KEY } from "@/constants/queue";
import { baseLogger } from "@/middlewares/logger";
import { MentionNotification, ReplyNotification } from "@/modules/notification-group/events/notification.events";
import type {
  CreateNotificationGroupInput,
  EnqueuePendingNotificationInput,
  FindAllNotificationGroupsInput,
  PendingCommentNotificationGroupKey,
  PendingCommentNotificationRedisKey,
  PendingCommentNotificationRedisPayload,
} from "@/modules/notification-group/interface/notification.types";
import { notificationRepository } from "@/modules/notification-group/repository/notification.repository";
import { redisService } from "@/providers/redis.provider";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { NotificationType, Prisma } from "@prisma/client";

type NotificationGroupListRow = Awaited<
  ReturnType<typeof notificationRepository.findByRecipientId>
>[number];

class NotificationService {
  create(data: CreateNotificationGroupInput, tx?: Prisma.TransactionClient) {
    return notificationRepository.create(
      {
        recipientId: data.recipientId,
        type: data.type,
        targetType: data.targetType,
        targetId: data.targetId,
        actorIds: [data.actorId],
        lastActorId: data.actorId,
        lastEventAt: data.lastEventAt ?? new Date(),
      },
      tx,
    );
  }

  async findAll({
    recipientId,
    after,
    take,
  }: FindAllNotificationGroupsInput): Promise<{
    rows: NotificationGroupListRow[];
    pagination: PaginationResponse<string | number | null>;
  }> {
    const notifications = await notificationRepository.findByRecipientId({
      recipientId,
      after,
      take,
    });

    return buildCursorPagination({
      rows: notifications,
      take,
      getAfter: (item) => item.publicId,
    });
  }

  private resolveGroupKey({
    isOwner,
    originPostId,
    groupKey,
  }: {
    isOwner: boolean;
    originPostId: string;
    groupKey?: PendingCommentNotificationGroupKey;
  }): PendingCommentNotificationGroupKey {
    if (groupKey) return groupKey;

    return isOwner ? `post:${originPostId}` : `thread:${originPostId}`;
  }

  async enqueuePendingNotification(input: EnqueuePendingNotificationInput) {
    const {
      actorId,
      recipientId,
      targetPostId,
      originPostId,
      username,
      postOwnerId,
      type,
      targetType,
      key,
      groupKey,
      avatar
    } = input;

    const isOwner = recipientId === postOwnerId;
    if (key.includes(":")) {
      throw new Error("Notification key must not contain ':'");
    }

    const resolvedGroupKey = this.resolveGroupKey({
      isOwner,
      originPostId,
      groupKey,
    });

    const redisKey: PendingCommentNotificationRedisKey =
      `notification:pending:${recipientId}:${key}:${resolvedGroupKey}`;

    baseLogger.info(`Handling pending notification for Redis key: ${redisKey}`);
    const pipeline = redisService.multi();

    const payload: PendingCommentNotificationRedisPayload = {
      key,
      type,
      targetType,
      groupKey: resolvedGroupKey,
      originPostId,
      targetPostId,
      isOwner: isOwner ? "true" : "false",
      lastActorId: actorId,
      updatedAt: String(Date.now()),
      username,
      avatar: avatar ?? "",
    };
    pipeline.hSet(redisKey, payload);

    pipeline.sAdd(`${redisKey}:actors`, actorId);
    pipeline.sCard(`${redisKey}:actors`);
    pipeline.hIncrBy(redisKey, "count", 1);

    pipeline.expire(redisKey, 3600);

    await pipeline.exec();

    await redisService.zAdd(NOTIFICATION_JOB_KEY.BATCH_SYNC_NOTIFICATION, {
      score: Date.now() + 5000,
      value: redisKey,
    });

    return redisKey;
  }

  async handleNewComment(relyNotification: ReplyNotification) {
    return this.enqueuePendingNotification({
      ...relyNotification,
      type: NotificationType.REPLY,
      targetType: "POST",
      key: "comment",
    });
  }

  async handleMention(mentionNotification: MentionNotification) {
    return this.enqueuePendingNotification({
      ...mentionNotification,
      type: NotificationType.MENTION,
      targetType: "POST",
      key: "mention",
    });
  }

}
export const notificationService = new NotificationService();
