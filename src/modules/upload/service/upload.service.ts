import configService from '@/config/config';
import { putObject } from '@/providers/cloudflare.provider';
import { generateKeyImage } from '@/util/upload.util';
import type { UploadMediaDataDto } from '../dto/response/upload-media.response.dto';

class UploadService {
    async uploadAvatar(file: Express.Multer.File) {
        const key = generateKeyImage('avatars', file.originalname);

        const result = await putObject({
            key,
            body: file.buffer
        });
        return {
            key: result,
            url: `${configService.R2_ENDPOINT}/${configService.R2_BUCKET_NAME}/${key}`,
        }
    }

    async uploadMedia(_payload: unknown): Promise<UploadMediaDataDto> {
        return {
            urls: [],
        };
    }
}

export const uploadService = new UploadService();