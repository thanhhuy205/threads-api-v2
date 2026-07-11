import { BLOOM_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { createQueue } from '@/providers/bullmq.provider';
class BloomProducer {
    private readonly queue = createQueue(QUEUE_NAME.BLOOM_QUEUE);

    constructor() {
    }


    async addUserNameAndEmailToBloom(payload: { userName: string; email: string }) {
        await this.queue.add(BLOOM_JOB_NAME.GENERATE_BLOOM, {
            ...payload,
        });
    }
}

export const bloomProducer = new BloomProducer();