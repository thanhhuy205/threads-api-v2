import { putObject } from '@/providers/cloudflare.provider';
import { generateKeyImage } from '@/util/upload.util';
import type { UploadMediaDataDto } from '../dto/response/upload-media.response.dto';
import { postMediaRepository } from '../repository/post-media.repository';

class UploadService {
    async uploadAvatar(file: Express.Multer.File) {
        const key = generateKeyImage('avatars', file.originalname);

        return putObject({
            key,
            body: file.buffer,
            contentType: file.mimetype,
        });
    }

    async uploadMedia(files: Express.Multer.File[]): Promise<UploadMediaDataDto> {
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                const key = generateKeyImage('post-media', file.originalname);
                const result = await putObject({
                    key,
                    body: file.buffer,
                    contentType: file.mimetype,
                });

                return {
                    key: result.key,
                    url: result.url,
                    type: 'IMAGE' as const,
                    status: 'UPLOADED' as const,
                };
            }),
        );

        const medias = await postMediaRepository.createMedia(uploadResults);

        return {
            medias,
        };
    }
}

export const uploadService = new UploadService();