import { BLOOM_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from '../src/middlewares/logger';
import { CreateBloomUserProducer } from '../src/modules/job/bloom/dto/create-bloom-user.dto';
import { createWorker } from "../src/providers/bullmq.provider";
import { redisService } from '../src/providers/redis.provider';

const redisReady = redisService.isOpen
    ? Promise.resolve()
    : redisService.connect().catch((error) => {
        console.error('Failed to connect Redis for bloom worker:', error);
        throw error;
    });


class BloomWorker {
    private readonly worker = createWorker(QUEUE_NAME.BLOOM_QUEUE, async (job) => {
        switch (job.name) {
            case BLOOM_JOB_NAME.GENERATE_BLOOM:
                return this.addUserNameAndEmailToBloom(job.data);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    });


    async addUserNameAndEmailToBloom(data: CreateBloomUserProducer) {
        await redisReady;
        await redisService.bf.add('filter:usernames', data.userName);
        await redisService.bf.add('filter:emails', data.email);
        baseLogger.info(`Added userName: ${data.userName} and email: ${data.email} to Bloom filter`);
    }
}

export const bloomWorker = new BloomWorker();