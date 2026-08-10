import { NOTIFICATION_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { Logger } from '@nestjs/common';
import { createQueue } from "@/providers/bullmq.provider";
import type { NotificationJobDto } from "../dto/notification.job.dto";

class NotificationProducer {
  private readonly logger = new Logger(NotificationProducer.name, { timestamp: true });
  private readonly notificationQueue = createQueue(QUEUE_NAME.NOTIFICATION_QUEUE);
  private readonly friendRequestQueue = createQueue(QUEUE_NAME.FRIEND_REQUEST_QUEUE);
  constructor() {
    this.logger.log("NotificationProducer initialized");
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
      this.logger.warn(
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
        repeat: { every: 5_000 },
        attempts: 1,
      },
    );
  }

  async initFriendRequest() {
    const repeatableJobs = await this.friendRequestQueue.getRepeatableJobs();
    const messageRepeatable = repeatableJobs.filter(
      (job) => job.name === NOTIFICATION_JOB_NAME.REALTIME_FRIEND_REQUEST_NOTIFICATION,
    );

    if (messageRepeatable.length > 0) {
      await Promise.all(
        messageRepeatable.map((job) =>
          this.friendRequestQueue.removeRepeatableByKey(job.key),
        ),
      );
      this.logger.warn(
        `Removed ${messageRepeatable.length} existing notification repeat jobs before re-initializing scheduler`,
      );
    }

    const payload: NotificationJobDto = {
      triggeredBy: "scheduler",
      requestedAt: new Date().toISOString(),
    };


    await this.friendRequestQueue.add(
      NOTIFICATION_JOB_NAME.REALTIME_FRIEND_REQUEST_NOTIFICATION,
      payload,
      {
        jobId: NOTIFICATION_JOB_NAME.REALTIME_FRIEND_REQUEST_NOTIFICATION,
        repeat: { every: 60_000 },
        attempts: 1,
      },
    );
  }

  get queue() {
    return this.notificationQueue;
  }
}

export const notificationProducer = new NotificationProducer();
