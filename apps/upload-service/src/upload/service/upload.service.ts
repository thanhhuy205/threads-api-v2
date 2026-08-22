import type { UploadedFile } from '@/common/types/http.type';
import configService from '@/config/config';
import { VideoProcedure } from '@/modules/job/video/producer/video.procedure';
import { generateKeyImage } from '@/util/upload.util';
import { CloudflareService } from '@libs/storage/cloudflare.service';
import { Injectable, Logger } from '@nestjs/common';
import { PostMediaStatus } from '@prisma/client';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import type { UploadMediaDataDto } from '../dto/response/upload-media.response.dto';
import { PostMediaRepository } from '../repository/post-media.repository';

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name, { timestamp: true });

    constructor(
        private readonly postMediaRepository: PostMediaRepository,
        private readonly videoProcedure: VideoProcedure,
        private readonly cloudflareService: CloudflareService,
    ) { }

    async uploadImage(file: UploadedFile, folder = 'avatars') {
        const key = generateKeyImage(folder, file.originalname);

        return this.cloudflareService.putObject({
            key,
            body: file.resizedBuffer || file.buffer,
            contentType: file.mimetype,
        });
    }

    async uploadAiImage(buffer: Buffer, folder = 'ai-images') {
        const key = generateKeyImage(folder, uuid());
        return this.cloudflareService.putObject({
            key,
            body: buffer,
            contentType: 'image/png',
        });
    }



    async uploadMedia(files: UploadedFile[]): Promise<UploadMediaDataDto> {
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                if (file.mimetype.startsWith('video/')) {
                    return this.getUploadVideosUrl(file);
                }
                const key = generateKeyImage('medias', file.originalname);
                const result = await this.cloudflareService.putObject({
                    key,
                    body: file.resizedBuffer || file.buffer,
                    contentType: file.mimetype,
                });

                return {
                    key: result.key,
                    url: result.url,
                    type: 'IMAGE' as const,
                    status: PostMediaStatus.UPLOADED,
                    width: file.width ?? null,
                    height: file.height ?? null,
                };
            }),
        );

        const medias = await this.postMediaRepository.createMedia(uploadResults);

        return {
            medias,
        };
    }

    async getUploadVideosUrl(file: UploadedFile) {
        const tempDirectory = path.resolve('temp');
        const folder = uuid();
        const fileName = path.basename(folder + path.extname(file.originalname));

        const tempDir = path.join(tempDirectory, folder);

        await mkdir(path.join(tempDirectory, folder), { recursive: true });
        await writeFile(path.join(tempDirectory, fileName), file.buffer);

        this.logger.log(`Added video to temp directory: ${fileName}, path: ${path.join(tempDirectory, fileName)}`);
        await this.videoProcedure.addHlsQueue({
            fileName,
            inputPath: path.join(tempDirectory, fileName),
            outputCloudDir: `hls/${folder}`,
            outputDir: tempDir,
            title: folder,
        });

        return {
            key: folder,
            url: `${configService.R2_CONFIG.R2_ENDPOINT}/${configService.R2_CONFIG.R2_BUCKET_NAME}/hls/${folder}/index.m3u8`,
            type: "VIDEO" as const,
            status: PostMediaStatus.UPLOADING,
            width: file.width ?? null,
            height: file.height ?? null,
        };
    }

}
