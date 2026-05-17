import { NOTIFICATION_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { baseLogger } from "@/middlewares/logger";
import { createQueue } from "@/providers/bullmq.provider";
import type { NotificationJobDto } from "../dto/notification.job.dto";

class NotificationProducer {
  private readonly notificationQueue = createQueue(QUEUE_NAME.NOTIFICATION_QUEUE);

  constructor() {
    baseLogger.info("NotificationProducer initialized");
  }


  async initSyncNotificationBatchJob() {
    const repeatableJobs = await this.notificationQueue.getRepeatableJobs();
    const notificationRepeatableJobs = repeatableJobs.filter(
      (job) => job.name === NOTIFICATION_JOB_NAME.BATCH_SYNC_NOTIFICATION,
    );

    if (notificationRepeatableJobs.length > 0) {
      await Promise.all(
        notificationRepeatableJobs.map((job) =>
          this.notificationQueue.removeRepeatableByKey(job.key),
        ),
      );
      baseLogger.warn(
        `Removed ${notificationRepeatableJobs.length} existing notification repeat jobs before re-initializing scheduler`,
      );
    }

    const payload: NotificationJobDto = {
      triggeredBy: "scheduler",
      requestedAt: new Date().toISOString(),
    };

    await this.notificationQueue.add(
      NOTIFICATION_JOB_NAME.BATCH_SYNC_NOTIFICATION,
      payload,
      {
        jobId: NOTIFICATION_JOB_NAME.BATCH_SYNC_NOTIFICATION,
        repeat: { every: 30_000 },
        attempts: 1,
      },
    );
  }

  get queue() {
    return this.notificationQueue;
  }
}

export const notificationProducer = new NotificationProducer();
