import configService from '@/config/config';
import { baseLogger } from '@/middlewares/logger';
import { videoProcedure } from '@/modules/job/video';
import { putObject } from '@/providers/cloudflare.provider';
import { generateKeyImage } from '@/util/upload.util';
import { PostMediaStatus } from '@prisma/client';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import type { UploadMediaDataDto } from '../dto/response/upload-media.response.dto';
import { postMediaRepository } from '../repository/post-media.repository';
class UploadService {
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

        const medias = await postMediaRepository.createMedia(uploadResults);

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

        baseLogger.info(`Added video to temp directory: ${fileName}, path: ${path.join(tempDirectory, fileName)}`);
        await videoProcedure.addHlsQueue({
            fileName,
            filePath: path.join(tempDirectory, fileName),
            outputCloudDir: `hls/${folder}`,
            outputDir: tempDir,
            title: folder,
        });

        return {
            key: folder,
            url: `https://${configService.R2_ENDPOINT}/${configService.R2_BUCKET_NAME}/hls/${folder}`,
            type: "VIDEO" as const,
            status: PostMediaStatus.UPLOADING,
            width: file.width ?? null,
            height: file.height ?? null,
        };
    }

}
export const uploadService = new UploadService();
