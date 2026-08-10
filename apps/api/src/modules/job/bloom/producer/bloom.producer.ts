import { BLOOM_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class BloomProducer {
    constructor(@InjectQueue(QUEUE_NAME.BLOOM_QUEUE) private readonly queue: Queue) { }

    async addUserNameAndEmailToBloom(payload: { userName: string; email: string }) {
        await this.queue.add(BLOOM_JOB_NAME.GENERATE_BLOOM, {
            ...payload,
        });
    }
}
