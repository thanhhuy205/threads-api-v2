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


  async addPostNotificationGroup({ postPublicId, notificationType, targetType, userId, authorId }: {
    postPublicId: string,
    notificationType: NotificationType,
    targetType: PostType,
    userId: string,
    authorId: string,
  }) {
    baseLogger.info(`Adding post notification group to Redis ${JSON.stringify({ postPublicId, notificationType, targetType, userId, authorId })}`);
    if (userId === authorId) return;
    baseLogger.info("Adding post notification group");


    const key = `notification:pending:post:${authorId}:${postPublicId}:${notificationType}`;
    const pendingListKey = `notification:pending:keys`;
    
    // Actor 
    const actorsKey = `${key}:actors`;

    const queuedKey = `${key}:queued`;
    await redisService.hIncrBy(key, "count", 1);
    const added = await redisService.sAdd(actorsKey, userId);
    if (added === 1) {
      await redisService.hSet(key, {
        authorId,
        postPublicId,
        notificationType,
        targetType,
        lastActorId: userId,
        userId: userId,
        updatedAt: Date.now().toString(),
      });
    }

    const queued = await redisService.set(queuedKey, "1", {
      EX: 60,
      NX: true,
    });

    if (queued === "OK") {
      await redisService.lPush(pendingListKey, key);
    }

    console.log("PUSHED:", {
      pendingListKey,
      key,
      queued,
      count: await redisService.hGet(key, "count"),
      listLength: await redisService.lLen(pendingListKey),
      listType: await redisService.type(pendingListKey),
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
