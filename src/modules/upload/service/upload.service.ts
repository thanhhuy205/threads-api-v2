import type { UploadAvatarDataDto } from '../dto/response/upload-avatar.response.dto';
import type { UploadMediaDataDto } from '../dto/response/upload-media.response.dto';

class UploadService {
    async uploadAvatar(_payload: unknown): Promise<UploadAvatarDataDto> {
        return {
            url: '',
        };
    }

    async uploadMedia(_payload: unknown): Promise<UploadMediaDataDto> {
        return {
            urls: [],
        };
    }
}

export const uploadService = new UploadService();