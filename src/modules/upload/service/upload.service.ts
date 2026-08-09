import configService from '@/config/config';
import { videoProcedure } from '@/modules/job/video';
import { putObject } from '@/providers/cloudflare.provider';
import { generateKeyImage } from '@/util/upload.util';
import { PostMediaStatus } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import type { UploadMediaDataDto } from '../dto/response/upload-media.response.dto';
import { PostMediaRepository } from '../repository/post-media.repository';

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name, { timestamp: true });

    constructor(private readonly postMediaRepository: PostMediaRepository) {}

    async uploadImage(file: Express.Multer.File, folder = 'avatars') {
        const key = generateKeyImage(folder, file.originalname);

        return putObject({
            key,
            body: file.resizedBuffer || file.buffer,
            contentType: file.mimetype,
        });
    }

    async uploadAiImage(buffer: Buffer, folder = 'ai-images') {
        const key = generateKeyImage(folder, uuid());
        return putObject({
            key,
            body: buffer,
            contentType: 'image/png',
        });
    }



    async uploadMedia(files: Express.Multer.File[]): Promise<UploadMediaDataDto> {
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                if (file.mimetype.startsWith('video/')) {
                    return this.getUploadVideosUrl(file);
                }
                const key = generateKeyImage('medias', file.originalname);
                const result = await putObject({
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

    async getUploadVideosUrl(file: Express.Multer.File) {
        const tempDirectory = path.resolve('temp');
        const folder = uuid();
        const fileName = path.basename(folder + path.extname(file.originalname));

        const tempDir = path.join(tempDirectory, folder);

        await mkdir(path.join(tempDirectory, folder), { recursive: true });
        await writeFile(path.join(tempDirectory, fileName), file.buffer);

        this.logger.log(`Added video to temp directory: ${fileName}, path: ${path.join(tempDirectory, fileName)}`);
        await videoProcedure.addHlsQueue({
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
