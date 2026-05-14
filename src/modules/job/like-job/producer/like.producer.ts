import { LIKE_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { baseLogger } from "@/middlewares/logger";
import { createQueue } from "@/providers/bullmq.provider";
import type { CreateJobLikeProducer } from "../dto/create-job-like-producer";

class LikeProducer {
  private readonly likeQueue = createQueue(QUEUE_NAME.LIKE_QUEUE);
  constructor() {
    baseLogger.info("LikeProducer initialized");
  }

  async syncPostLike(payload: CreateJobLikeProducer) {
    await this.likeQueue.add(LIKE_JOB_NAME.SYNC_POST_LIKE, payload, {
      delay: 1000,
    });
  }

  async initSyncJob() {
    const repeatableJobs = await this.likeQueue.getRepeatableJobs();
    const likeSyncRepeatableJobs = repeatableJobs.filter(
      (job) => job.name === LIKE_JOB_NAME.INIT_SYNC_JOB,
    );

    if (likeSyncRepeatableJobs.length > 0) {
      await Promise.all(
        likeSyncRepeatableJobs.map((job) =>
          this.likeQueue.removeRepeatableByKey(job.key),
        ),
      );
      baseLogger.warn(
        `Removed ${likeSyncRepeatableJobs.length} existing like sync repeat jobs before re-initializing scheduler`,
      );
    }

    await this.likeQueue.add(LIKE_JOB_NAME.INIT_SYNC_JOB, {}, {
      jobId: LIKE_JOB_NAME.INIT_SYNC_JOB,
      repeat: { every: 5000 },
      attempts: 1,
    });
  }

  get queue() {
    return this.likeQueue;
  }
}

export const likeProducer = new LikeProducer();
