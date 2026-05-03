import { BLOOM_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from '../src/middlewares/logger';
import { CreateBloomUserProducer } from '../src/modules/job/bloom/dto/create-bloom-user.dto';
import { createWorker } from "../src/providers/bullmq.provider";
import { ensureRedisConnection } from '../src/providers/redis.provider';


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
        const redisClient = await ensureRedisConnection();
        await redisClient.bf.add('filter:usernames', data.userName);
        await redisClient.bf.add('filter:emails', data.email);
        baseLogger.info(`Added userName: ${data.userName} and email: ${data.email} to Bloom filter`);
    }
}

export const bloomWorker = new BloomWorker();