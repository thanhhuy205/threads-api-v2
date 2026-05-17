import { notificationRepository } from "@/modules/notification-group/repository/notification.repository";
import { pusher } from "@/providers/pusher.provider";
import { redisService } from "@/providers/redis.provider";
import { NotificationType } from "@prisma/client";
import { NOTIFICATION_JOB_KEY, NOTIFICATION_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from "../src/middlewares/logger";
import { createWorker } from "../src/providers/bullmq.provider";

class NotificationWorker {
  private readonly worker = createWorker(QUEUE_NAME.NOTIFICATION_QUEUE, async (job) => {
    switch (job.name) {
      case NOTIFICATION_JOB_NAME.BATCH_SYNC_NOTIFICATION:
        return this.batchCommentNotification();
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });

  buildNotificationMessage({ meta, actorCount, actors }: {
    meta: {
      type: string,
      groupKey: string,
      postId: string,
      isOwner: boolean,
      lastActorId: string,
      lastCommentId: string,
      updatedAt: Date,
      count: number,
    },
    actorCount: number,
    actors: string[],
  }) {
    const { isOwner, count, lastActorId, groupKey } = meta;
    const firstName = actors[0]; // lấy tên từ DB hoặc cache

    // Nhóm 5: thread của người khác
    if (!isOwner) {
      if (actorCount === 1) return `${firstName} đã bình luận trong cuộc trò chuyện bạn tham gia`;
      return `${firstName} và ${actorCount - 1} người khác đã trả lời trong cuộc trò chuyện`;
    }

    // Nhóm 1: 1 người, 1 bài, nhiều lần
    if (actorCount === 1 && count > 1) {
      return `${firstName} đã bình luận ${count} lần về bài của bạn`;
    }

    // Nhóm 2: 1 người, nhiều bài → cần check thêm
    // (groupKey sẽ là "actor:{actorId}" thay vì "post:{postId}")

    // Nhóm 3: nhiều người, 1 bài
    if (actorCount === 2) return `${actors[0]} và ${actors[1]} đã bình luận về bài của bạn`;
    if (actorCount > 2) return `${actors[0]}, ${actors[1]} và ${actorCount - 2} người khác đã bình luận về bài của bạn`;

    // Default
    return `${firstName} đã bình luận về bài của bạn`;
  }
  async batchCommentNotification() {
    const now = Date.now();

    const dueItems = await redisService.zRangeByScore(
      NOTIFICATION_JOB_KEY.BATCH_SYNC_NOTIFICATION,
      "-inf",
      now
    );

    if (!dueItems.length) return;
    const notificationSave: {
      recipientId: string;
      meta: {
        type: NotificationType,
        groupKey: string,
        postId: string,
        isOwner: 'true',
        lastActorId: string,
        lastCommentId: string,
        updatedAt: string,
        count: string,
      },
      actorCount: 1,
      actors: [string]
    }[] = [];
    for (const redisKey of dueItems) {
      baseLogger.info(`[QUEUE_ITEM] ${redisKey}`);

      const [meta, actorCount, actors] = await Promise.all([
        redisService.hGetAll(redisKey),
        redisService.sCard(`${redisKey}:actors`),
        redisService.sMembers(`${redisKey}:actors`),
      ]);

      if (!Object.keys(meta).length) {
        await redisService.zRem(NOTIFICATION_JOB_KEY.BATCH_SYNC_NOTIFICATION, redisKey);
        continue;
      }

      const recipientId = redisKey.split(":")[2];
      notificationSave.push({
        recipientId,
        meta,
        actorCount,
        actors,
      });
      const message = this.buildNotificationMessage({
        meta: {
          ...meta,
          isOwner: meta.isOwner === "true",
          count: Number(meta.count ?? 0),
          updatedAt: new Date(Number(meta.updatedAt)),
        },
        actorCount,
        actors,
      });

      await this.sendPushNotification(recipientId, message);

      await redisService.del([redisKey, `${redisKey}:actors`]);
      await redisService.zRem(NOTIFICATION_JOB_KEY.BATCH_SYNC_NOTIFICATION, redisKey);
    }
    await notificationRepository.createMany(
      notificationSave.map((item) => ({
        recipientId: item.recipientId,
        type: item.meta.type as NotificationType,
        targetType: "POST",
        targetId: item.meta.postId,
        actorIds: item.actors,
        lastActorId: item.meta.lastActorId,
        lastEventAt: new Date(),
        count: Number(item.meta.count ?? 0),
      })),
    );
    console.log(notificationSave)
  }
  async sendPushNotification(recipientId: string, message: string) {
    console.log(`Sending push notification to user ${recipientId}: ${message}`);
    await pusher.trigger(`private-user-notification-${recipientId}`, "new-notifications", {
      recipientId,
      message,
    });
  }

}

export const notificationWorker = new NotificationWorker();
