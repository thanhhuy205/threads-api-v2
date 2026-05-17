import type {
  CommentNotificationMessageMeta,
  PendingCommentNotificationBatchItem,
  PendingCommentNotificationRedisKey,
  PendingCommentNotificationRedisMeta,
} from "@/modules/notification-group/interface/notification.types";
import { notificationRepository } from "@/modules/notification-group/repository/notification.repository";
import { pusher } from "@/providers/pusher.provider";
import { redisService } from "@/providers/redis.provider";
import { NotificationType } from "@prisma/client";
import { NOTIFICATION_JOB_KEY, NOTIFICATION_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from "../src/middlewares/logger";
import { createWorker } from "../src/providers/bullmq.provider";

const pendingCommentKeyPattern =
  /^notification:pending:([^:]+):comment:(post|thread):(.+)$/;

const requiredPendingCommentMetaFields = [
  "type",
  "groupKey",
  "originPostId",
  "targetPostId",
  "isOwner",
  "lastActorId",
  "updatedAt",
  "count",
  "username",
] satisfies (keyof PendingCommentNotificationRedisMeta)[];

const extractRecipientIdFromPendingCommentKey = (
  redisKey: string,
): string | null => {
  const match = redisKey.match(pendingCommentKeyPattern);
  return match?.[1] ?? null;
};

const toPendingCommentNotificationMeta = (
  meta: Record<string, string>,
): PendingCommentNotificationRedisMeta | null => {
  const missingFields = requiredPendingCommentMetaFields.filter(
    (field) => !(field in meta),
  );

  if (missingFields.length) return null;
  if (meta.isOwner !== "true" && meta.isOwner !== "false") return null;

  return meta as PendingCommentNotificationRedisMeta;
};

class NotificationWorker {
  private readonly worker = createWorker(QUEUE_NAME.NOTIFICATION_QUEUE, async (job) => {
    switch (job.name) {
      case NOTIFICATION_JOB_NAME.BATCH_SYNC_NOTIFICATION:
        return this.batchCommentNotification();
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });

  buildNotificationMessage({
    meta,
    actorCount,
    actors,
  }: {
    meta: CommentNotificationMessageMeta;
    actorCount: number;
    actors: string[];
  }) {
    const { isOwner, count, username } = meta;
    const firstName = username;

    if (!isOwner) {
      if (actorCount === 1) return `${firstName} đã bình luận trong cuộc trò chuyện bạn tham gia`;
      return `${firstName} và ${actorCount - 1} người khác đã trả lời trong cuộc trò chuyện`;
    }

    if (actorCount === 1 && count > 1) {
      return `${firstName} đã bình luận ${count} lần về bài của bạn`;
    }
    if (actorCount >= 2) return `${firstName}, ${actorCount - 1} người khác đã bình luận về bài của bạn`;

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
    const notificationSave: PendingCommentNotificationBatchItem[] = [];

    for (const redisKey of dueItems as PendingCommentNotificationRedisKey[]) {
      baseLogger.info(`[QUEUE_ITEM] ${redisKey}`);

      const [rawMeta, actorCount, actors] = await Promise.all([
        redisService.hGetAll(redisKey),
        redisService.sCard(`${redisKey}:actors`),
        redisService.sMembers(`${redisKey}:actors`),
      ]);

      const meta = toPendingCommentNotificationMeta(rawMeta);
      const recipientId = extractRecipientIdFromPendingCommentKey(redisKey);
      const missingFields = requiredPendingCommentMetaFields.filter(
        (field) => !(field in rawMeta),
      );

      if (!meta || !recipientId) {
        baseLogger.warn(
          `[notification-worker] Invalid pending comment notification: ${JSON.stringify({
            redisKey,
            recipientId,
            missingFields,
            meta: rawMeta,
          })}`,
        );
        await redisService.zRem(NOTIFICATION_JOB_KEY.BATCH_SYNC_NOTIFICATION, redisKey);
        continue;
      }

      notificationSave.push({
        redisKey,
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
        targetId: item.meta.targetPostId,
        originPostId: item.meta.originPostId,
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
