import { CreateBloomUserProducer } from '@api/modules/job/bloom/dto/create-bloom-user.dto';
import { RedisService } from '@libs/cache/redis.service';
import { BLOOM_JOB_NAME, QUEUE_NAME } from "@libs/core/constants/queue";
import { redisKey } from "@libs/core/constants/redis-key";
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';



@Processor(QUEUE_NAME.BLOOM_QUEUE)
export class BloomWorker extends WorkerHost {
    private readonly logger = new Logger(BloomWorker.name, { timestamp: true });
    constructor(private readonly redisService: RedisService) {
        super();
    }
    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case BLOOM_JOB_NAME.GENERATE_BLOOM:
                return this.addUserNameAndEmailToBloom(job.data);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }


    async addUserNameAndEmailToBloom(data: CreateBloomUserProducer) {
        await this.redisService.redis.bf.add(redisKey.bloom.usernames(), data.userName);
        await this.redisService.redis.bf.add(redisKey.bloom.emails(), data.email);
        this.logger.log(`Added userName: ${data.userName} and email: ${data.email} to Bloom filter`);
    }
}
