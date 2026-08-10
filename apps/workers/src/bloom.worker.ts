import { BLOOM_JOB_NAME, QUEUE_NAME } from "@libs/core/constants/queue";
import { redisKey } from "@libs/core/constants/resolve-key/redis-key";
import { Logger } from '@nestjs/common';
import { CreateBloomUserProducer } from '@api/modules/job/bloom/dto/create-bloom-user.dto';
import { createWorker } from "@libs/core/providers/bullmq.provider";
import { redisService } from '@libs/core/providers/redis.provider';



class BloomWorker {
    private readonly logger = new Logger(BloomWorker.name, { timestamp: true });
    private readonly worker = createWorker(QUEUE_NAME.BLOOM_QUEUE, async (job) => {
        switch (job.name) {
            case BLOOM_JOB_NAME.GENERATE_BLOOM:
                return this.addUserNameAndEmailToBloom(job.data);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    });


    async addUserNameAndEmailToBloom(data: CreateBloomUserProducer) {
        await redisService.bf.add(redisKey.bloom.usernames(), data.userName);
        await redisService.bf.add(redisKey.bloom.emails(), data.email);
        this.logger.log(`Added userName: ${data.userName} and email: ${data.email} to Bloom filter`);
    }
}

export const bloomWorker = new BloomWorker();
