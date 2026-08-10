import { HLS_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import type { HlsQueueDto } from '../dto/hls-queue.dto';

@Injectable()
export class VideoProcedure {
    constructor(@InjectQueue(QUEUE_NAME.VIDEO_QUEUE) private readonly queue: Queue) { }

    async addHlsQueue(payload: HlsQueueDto) {
        return this.queue.add(HLS_JOB_NAME.HLS_JOB_GENERATE_HLS, payload);
    }
}
