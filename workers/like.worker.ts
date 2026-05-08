import { LIKE_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from "../src/middlewares/logger";
import type { CreateJobLikeProducer } from "../src/modules/job/like-job/dto/create-job-like-producer";
import { likeRepository } from "../src/modules/post/repository/like.repository";
import { postRepository } from "../src/modules/post/repository/post.repository";
import { createWorker } from "../src/providers/bullmq.provider";
import { redisService } from "../src/providers/redis.provider";

class LikeWorker {
  private readonly worker = createWorker(QUEUE_NAME.LIKE_QUEUE, async (job) => {
    switch (job.name) {
      case LIKE_JOB_NAME.SYNC_POST_LIKE:
        return this.syncPostLike(job.data);

      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });

  async syncPostLike(data: CreateJobLikeProducer) {
    const likeKey = `post:${data.publicId}:${data.userId}:likes`;
    const likeState = await redisService.get(likeKey);

    if (likeState === null) {
      baseLogger.info(
        `Skip like sync for ${likeKey} because no Redis state was found`,
      );
      return;
    }
    const old = await likeRepository.findByUserIdAndPublicId(
      data.userId,
      data.publicId,
    );
    baseLogger.info(`old: ${JSON.stringify(old)}`);
    baseLogger.info(`likeState: ${likeState}`);
    const isLiked = likeState === "1";

    await likeRepository.upsert({
      publicId: data.publicId,
      userId: data.userId,
      isLiked,
    });

    if (isLiked) {
      if (old?.isLike) {
        return;
      } else {
        await postRepository.incrementLikedCount(data.publicId, data.userId);
      }
    } else {
      if (old?.isLike) {
        await postRepository.decrementLikedCount(data.publicId, data.userId);
      } else {
        return;
      }
    }
    baseLogger.info(`Synced like state for ${likeKey}: ${likeState}`);
  }
}

export const likeWorker = new LikeWorker();
