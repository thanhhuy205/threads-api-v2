import { notificationService } from "@/modules/notification-group/service/notification.service";
import { pusher } from "@/providers/pusher.provider";
import { redisService } from "@/providers/redis.provider";
import { NotificationType, PostType } from "@prisma/client";
import { NOTIFICATION_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from "../src/middlewares/logger";
import type { NotificationJobDto } from "../src/modules/job/notification-job/dto/notification.job.dto";
import { createWorker } from "../src/providers/bullmq.provider";

class NotificationWorker {
  private readonly worker = createWorker(QUEUE_NAME.NOTIFICATION_QUEUE, async (job) => {
    switch (job.name) {
      case NOTIFICATION_JOB_NAME.INIT_SYNC_NOTIFICATION_BATCH:
        return this.runBatchNotification(job.data as NotificationJobDto, job.id);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });

  async runBatchNotification(payload: NotificationJobDto, jobId?: string) {
    const pendingListKey = "notification:pending:keys";

    const keys = await redisService.rPopCount(pendingListKey, 10);

    const notificationBatch = [];

    console.log("BEFORE POP:", {
      listLength: await redisService.lLen(pendingListKey),
      listType: await redisService.type(pendingListKey),
    });
    console.log(keys);
    if (!keys || keys.length === 0) {
      baseLogger.info(
        `[notification-worker] No pending notifications to process`,
      );
      return;
    }

    for (const key of keys) {
      const data = await redisService.hGetAll(key);
      console.log("PROCESS:", {
        key,
        data,
      });

      if (!data?.authorId) {
        await redisService.del(`${key}:queued`);
        continue;
      }

      const count = Number(data.count || 0);

      if (count <= 0) {
        await redisService.del(key);
        await redisService.del(`${key}:queued`);
        continue;
      }

      notificationBatch.push({
        authorId: data.authorId,
        postPublicId: data.postPublicId,
        notificationType: data.notificationType as NotificationType,
        targetType: data.targetType as PostType,
        lastActorId: data.lastActorId,
        count,
      });

      await redisService.del(key);
      await redisService.del(`${key}:queued`);
    }

    await notificationService.addNotificationPostAllBatch(notificationBatch);
    baseLogger.info(
      `[notification-worker] Processed ${NOTIFICATION_JOB_NAME.INIT_SYNC_NOTIFICATION_BATCH}: ${JSON.stringify(notificationBatch)}`,
    );
    await pusher.trigger("notifications", "new-notifications", {
      message: "You have new notifications",
      count: notificationBatch.reduce((sum, item) => sum + item.count, 0),
    });
  }
}

export const notificationWorker = new NotificationWorker();
