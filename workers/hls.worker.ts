import { generateVideoSegments } from "@/util/ffmpeg.util";
import { HLS_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from '../src/middlewares/logger';
import type { HlsQueueDto } from "../src/modules/job/video/dto/hls-queue.dto";
import type { HlsWebhookRequestDto } from "../src/modules/webhooks/dto/request/hls-webhook.request.dto";
import { createWorker } from "../src/providers/bullmq.provider";

class HlsWorker {
    private readonly worker = createWorker(QUEUE_NAME.VIDEO_QUEUE, async (job) => {
        switch (job.name) {
            case HLS_JOB_NAME.HLS_JOB_GENERATE_HLS:
                return this.addJobGenerateHls(job.data);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }, {
        concurrency: 1,

    });

    async addJobGenerateHls(data: HlsQueueDto) {
        const { inputPath, outputDir, title, fileName, outputCloudDir } = data;
        baseLogger.info(`Generating HLS for title: ${title}, filePath: ${inputPath}, outputDir: ${outputDir}`);
        await generateVideoSegments(inputPath, outputDir, fileName, outputCloudDir);

        const webhookPayload: HlsWebhookRequestDto = {
            title,
            outputCloudDir,
            data: {
                status: 'ready',
                url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${outputCloudDir}/index.m3u8`,
                key: title,
            },
            type: 'video.asset.ready',
        };

        await fetch(process.env.HOOK_API_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-signature': `${process.env.HOOK_SECRET_KEY}`,
            },
            body: JSON.stringify(webhookPayload),
        });
    }
}

export const hlsWorker = new HlsWorker();
