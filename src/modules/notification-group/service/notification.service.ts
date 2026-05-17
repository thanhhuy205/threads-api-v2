import { NOTIFICATION_JOB_KEY } from "@/constants/queue";
import { baseLogger } from "@/middlewares/logger";
import type {
  CreateNotificationGroupInput,
  FindAllNotificationGroupsInput,
} from "@/modules/notification-group/interface/notification.types";
import { notificationRepository } from "@/modules/notification-group/repository/notification.repository";
import { redisService } from "@/providers/redis.provider";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { NotificationType, PostType, Prisma } from "@prisma/client";

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
        userId: data.userId,
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


  async handleNewComment({ actorId, recipientId, postId, postOwnerId, replyId }: {
    actorId: string;
    recipientId: string;
    postId: string;
    postOwnerId: string;
    replyId?: string;
  }) {
    // Kiểm tra xem người nhận có phải là chủ bài viết không để xác định group key
    const isOwner = recipientId === postOwnerId;
    // Nếu là chủ groupKey thì đặt tên là post , còn nếu không đặt tên là thread để phân biệt với comment của post
    const groupKey = isOwner ? `post:${postId}` :
      `thread:${postId}`;

    // Tạo khóa Redis cho nhóm thông báo này
    const redisKey = `notification:pending:${recipientId}:comment:${groupKey}`;
    baseLogger.info(`Handling new comment notification for Redis key: ${redisKey}`);
    // Sử dụng pipeline để thực hiện các lệnh Redis một cách hiệu quả
    const pipeline = redisService.multi();


    // Cập nhật thông tin nhóm thông báo trong Redis
    const payload: Record<string, string> = {
      type: NotificationType.REPLY,
      groupKey: String(groupKey),
      postId: String(postId),
      isOwner: String(isOwner),
      lastActorId: String(actorId),
      lastCommentId: replyId ?? "",
      updatedAt: String(Date.now()),
    };
    pipeline.hSet(redisKey, payload);

    // Thêm actor vào set của nhóm thông báo và tăng số lượng thông báo
    pipeline.sAdd(`${redisKey}:actors`, actorId);
    pipeline.sCard(`${redisKey}:actors`); // đếm số người đã tương tác để cập nhật count
    pipeline.hIncrBy(redisKey, 'count', 1);

    // Đặt thời gian hết hạn cho khóa Redis để tránh lưu trữ quá lâu
    pipeline.expire(redisKey, 3600);

    // Thực hiện các lệnh trong pipeline
    await pipeline.exec();

    await redisService.zAdd(NOTIFICATION_JOB_KEY.BATCH_SYNC_NOTIFICATION, {
      score: Date.now() + 5000,
      value: redisKey,
    });
  }


  async addNotificationPostAllBatch(batch: {
    authorId: string;
    postPublicId: string;
    notificationType: NotificationType;
    actorIds: string[];
    targetType: PostType;
    lastActorId: string;
    count: number;
  }[]) {

    baseLogger.info(`Adding post notification group batch to Redis ${JSON.stringify(batch)}`);
    await notificationRepository.createMany(
      batch.map((item) => ({
        recipientId: item.authorId,
        type: item.notificationType as NotificationType,
        targetType: item.targetType,
        targetId: item.postPublicId,
        actorIds: item.actorIds,
        lastActorId: item.lastActorId,
        lastEventAt: new Date(),
        count: item.count,
      })),
    );
  }
}
export const notificationService = new NotificationService();
