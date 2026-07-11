import { HLS_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { createQueue } from '@/providers/bullmq.provider';
import type { HlsQueueDto } from '../dto/hls-queue.dto';

class VideoProcedure {
    private readonly queue = createQueue(QUEUE_NAME.VIDEO_QUEUE, {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: false,
    });

    async addHlsQueue(payload: HlsQueueDto) {
        return this.queue.add(HLS_JOB_NAME.HLS_JOB_GENERATE_HLS, payload);
    }
}

export const videoProcedure = new VideoProcedure();
