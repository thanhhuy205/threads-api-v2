import { LIKE_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { baseLogger } from '@/middlewares/logger';
import type { CreateJobLikeProducer } from '@/modules/job/like-job/dto/create-job-like-producer';
import { likeRepository } from '@/modules/post/repository/like.repository';
import { createWorker } from '@/providers/bullmq.provider';
import { redisService } from '@/providers/redis.provider';

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
            baseLogger.info(`Skip like sync for ${likeKey} because no Redis state was found`);
            return;
        }

        const isLiked = likeState === '1';

        await likeRepository.upsert({
            publicId: data.publicId,
            userId: data.userId,
            isLiked,
        });

        baseLogger.info(`Synced like state for ${likeKey}: ${likeState}`);
    }
}

export const likeWorker = new LikeWorker();