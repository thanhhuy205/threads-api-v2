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
    await this.likeQueue.add(LIKE_JOB_NAME.INIT_SYNC_JOB, {}, {
      repeat: { every: 5000 },
    });
  }
}

export const likeProducer = new LikeProducer();
