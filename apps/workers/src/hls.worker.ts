import { generateVideoSegments } from "@libs/core/util/ffmpeg.util";
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { HLS_JOB_NAME, QUEUE_NAME } from "@libs/core/constants/queue";
import type { HlsQueueDto } from "@api/modules/job/video/dto/hls-queue.dto";
import { PostMediaRepository } from "@api/modules/upload/repository/post-media.repository";
import { PostMediaStatus } from "@prisma/client";
import configService from '@libs/core/config/config';
import { Job } from 'bullmq';

@Processor(QUEUE_NAME.VIDEO_QUEUE, { concurrency: 1 })
export class HlsWorker extends WorkerHost {
    private readonly logger = new Logger(HlsWorker.name, { timestamp: true });

    constructor(private readonly postMediaRepository: PostMediaRepository) {
        super();
    }
    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case HLS_JOB_NAME.HLS_JOB_GENERATE_HLS:
                return this.addJobGenerateHls(job.data);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    async addJobGenerateHls(data: HlsQueueDto) {
        const { inputPath, outputDir, title, fileName, outputCloudDir } = data;
        this.logger.log(`Generating HLS for title: ${title}, filePath: ${inputPath}, outputDir: ${outputDir}`);
        await generateVideoSegments(inputPath, outputDir, fileName, outputCloudDir);

        await this.postMediaRepository.updateMediaStatus({
            key: title,
            status: PostMediaStatus.UPLOADED,
            url: `${configService.R2_CONFIG.R2_ENDPOINT}/${configService.R2_CONFIG.R2_BUCKET_NAME}/${outputCloudDir}/index.m3u8`,
        });
    }
}
