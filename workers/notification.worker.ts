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
    const processedAt = new Date().toISOString();
    const result = {
      jobId: jobId ?? "unknown",
      triggeredBy: payload.triggeredBy ?? "scheduler",
      requestedAt: payload.requestedAt ?? processedAt,
      processedAt,
    };

    baseLogger.info(
      `[notification-worker] Processed ${NOTIFICATION_JOB_NAME.INIT_SYNC_NOTIFICATION_BATCH}: ${JSON.stringify(result)}`,
    );

    return result;
  }
}

export const notificationWorker = new NotificationWorker();
