import { generateVideoSegments } from "@libs/core/util/ffmpeg.util";
import { Logger } from '@nestjs/common';
import { HLS_JOB_NAME, QUEUE_NAME } from "@libs/core/constants/queue";
import type { HlsQueueDto } from "@api/modules/job/video/dto/hls-queue.dto";
import { createWorker } from "@libs/core/providers/bullmq.provider";
import { PostMediaRepository } from "@api/modules/upload/repository/post-media.repository";
import { PostMediaStatus } from "@prisma/client";
import configService from '@libs/core/config/config';

class HlsWorker {
    private readonly logger = new Logger(HlsWorker.name, { timestamp: true });

    constructor(private readonly postMediaRepository: PostMediaRepository) {}
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
        this.logger.log(`Generating HLS for title: ${title}, filePath: ${inputPath}, outputDir: ${outputDir}`);
        await generateVideoSegments(inputPath, outputDir, fileName, outputCloudDir);

        await this.postMediaRepository.updateMediaStatus({
            key: title,
            status: PostMediaStatus.UPLOADED,
            url: `${configService.R2_CONFIG.R2_ENDPOINT}/${configService.R2_CONFIG.R2_BUCKET_NAME}/${outputCloudDir}/index.m3u8`,
        });
    }
}

export const createHlsWorker = (postMediaRepository: PostMediaRepository) =>
    new HlsWorker(postMediaRepository);
