import { LIKE_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { createQueue } from '@/providers/bullmq.provider';
import type { CreateJobLikeProducer } from '../dto/create-job-like-producer';

class LikeProducer {
    private readonly likeQueue = createQueue(QUEUE_NAME.LIKE_QUEUE);

    async syncPostLike(payload: CreateJobLikeProducer) {
        await this.likeQueue.add(LIKE_JOB_NAME.SYNC_POST_LIKE, payload, {
            delay: 1000,
        });
    }
}

export const likeProducer = new LikeProducer();