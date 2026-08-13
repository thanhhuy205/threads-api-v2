import { NOTIFICATION_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import type { NotificationJobDto } from "../dto/notification.job.dto";

@Injectable()
export class NotificationProducer {
  private readonly logger = new Logger(NotificationProducer.name, { timestamp: true });
  constructor(
    @InjectQueue(QUEUE_NAME.NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
  ) {
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

  get queue() {
    return this.notificationQueue;
  }
}
