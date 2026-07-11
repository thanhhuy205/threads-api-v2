import { AUTO_REMOVE_BAN_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { baseLogger } from "@/middlewares/logger";
import { createQueue } from "@/providers/bullmq.provider";
import type { AutoRemoveBanJobDto } from "../dto/auto-remove-ban.job.dto";

class AutoRemoveBanProducer {
  private readonly autoRemoveBanQueue = createQueue(QUEUE_NAME.AUTO_REMOVE_BAN_QUEUE);

  constructor() {
    baseLogger.info("AutoRemoveBanProducer initialized");
  }

  async initAutoRemoveBanJob() {
    const repeatableJobs = await this.autoRemoveBanQueue.getRepeatableJobs();
    const autoRemoveBanRepeatableJobs = repeatableJobs.filter(
      (job) => job.name === AUTO_REMOVE_BAN_JOB_NAME.RUN_AUTO_REMOVE_BAN,
    );

    if (autoRemoveBanRepeatableJobs.length > 0) {
      await Promise.all(
        autoRemoveBanRepeatableJobs.map((job) =>
          this.autoRemoveBanQueue.removeRepeatableByKey(job.key),
        ),
      );
      baseLogger.warn(
        `Removed ${autoRemoveBanRepeatableJobs.length} existing auto-remove-ban repeat jobs before re-initializing scheduler`,
      );
    }

    const payload: AutoRemoveBanJobDto = {
      triggeredBy: "scheduler",
      requestedAt: new Date().toISOString(),
    };

    await this.autoRemoveBanQueue.add(
      AUTO_REMOVE_BAN_JOB_NAME.RUN_AUTO_REMOVE_BAN,
      payload,
      {
        jobId: AUTO_REMOVE_BAN_JOB_NAME.RUN_AUTO_REMOVE_BAN,
        repeat: { every: 60 * 60 * 1000 },
        attempts: 1,
      },
    );
  }

  get queue() {
    return this.autoRemoveBanQueue;
  }
}

export const autoRemoveBanProducer = new AutoRemoveBanProducer();
