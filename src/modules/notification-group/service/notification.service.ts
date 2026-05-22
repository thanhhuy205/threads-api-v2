import { NOTIFICATION_JOB_KEY } from "@/constants/queue";
import { baseLogger } from "@/middlewares/logger";
import { ReplyNotification } from "@/modules/notification-group/events/notification.events";
import type {
  CreateNotificationGroupInput,
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


  async handleNewComment(relyNotification: ReplyNotification) {
    const {
      actorId,
      recipientId,
      targetPostId,
      originPostId,
      username,
      postOwnerId,
    } = relyNotification;

    const isOwner = recipientId === postOwnerId;
    // Nếu là chủ groupKey thì đặt tên là post , còn nếu không đặt tên là thread để phân biệt với comment của post
    const groupKey: PendingCommentNotificationGroupKey = isOwner
      ? `post:${targetPostId}`
      : `thread:${targetPostId}`;

    // Tạo khóa Redis cho nhóm thông báo này
    const redisKey: PendingCommentNotificationRedisKey =
      `notification:pending:${recipientId}:comment:${groupKey}`;


    baseLogger.info(`Handling new comment notification for Redis key: ${redisKey}`);
    const pipeline = redisService.multi();


    const payload: PendingCommentNotificationRedisPayload = {
      type: NotificationType.REPLY,
      groupKey,
      originPostId,
      targetPostId,
      isOwner: isOwner ? "true" : "false",
      lastActorId: actorId,
      updatedAt: String(Date.now()),
      username
    };
    pipeline.hSet(redisKey, payload);

    pipeline.sAdd(`${redisKey}:actors`, actorId);
    pipeline.sCard(`${redisKey}:actors`); // đếm số người đã tương tác để cập nhật count
    pipeline.hIncrBy(redisKey, 'count', 1);

    pipeline.expire(redisKey, 3600);

    await pipeline.exec();

    await redisService.zAdd(NOTIFICATION_JOB_KEY.BATCH_SYNC_NOTIFICATION, {
      score: Date.now() + 5000,
      value: redisKey,
    });
  }

}
export const notificationService = new NotificationService();
