import configService from '@/config/config';
import { putObject } from '@/providers/cloudflare.provider';
import { muxClient } from '@/providers/mux.provider';
import { generateKeyImage } from '@/util/upload.util';
import { PostMediaStatus } from '@prisma/client';
import type { UploadMediaDataDto } from '../dto/response/upload-media.response.dto';
import { postMediaRepository } from '../repository/post-media.repository';

class UploadService {
    async uploadAvatar(file: Express.Multer.File) {
        const key = generateKeyImage('avatars', file.originalname);

        return putObject({
            key,
            body: file.resizedBuffer || file.buffer,
            contentType: file.mimetype,
        });
    }

    async uploadMedia(files: Express.Multer.File[]): Promise<UploadMediaDataDto> {
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                if (file.mimetype.startsWith('video/')) {
                    return this.getUploadVideosUrl();
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
            media: medias,
        };
    }

    async getUploadVideosUrl() {
        const upload = await muxClient.video.uploads.create({
            new_asset_settings: {
                playback_policy: ['public'],
            },
            cors_origin: configService.FRONTEND_URL,
        });
        return {
            url: upload.url ?? '',
            status: upload.status === 'waiting' ? PostMediaStatus.UPLOADING : PostMediaStatus.UPLOADED,
            type: 'VIDEO' as const,
            key: upload.id,
            width: null,
            height: null,
        };
    }

}
export const uploadService = new UploadService();