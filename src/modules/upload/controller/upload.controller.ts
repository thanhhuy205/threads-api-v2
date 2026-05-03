import { UPLOAD_MESSAGE } from '@/constants/message';
import { uploadService } from '@/modules/upload/service/upload.service';
import { Request, Response } from 'express';
import type { UploadAvatarDto } from '../dto/request/upload-avatar.request.dto';
import type { UploadMediaDto } from '../dto/request/upload-media.request.dto';

class UploadController {
    async uploadAvatar(req: Request<{}, {}, UploadAvatarDto>, res: Response) {
        const result = await uploadService.uploadAvatar(req.file!);
        return res.success(201, UPLOAD_MESSAGE.UPLOAD_AVATAR_SUCCESS, result);
    }

    async uploadMedia(req: Request<{}, {}, UploadMediaDto>, res: Response) {
        const result = await uploadService.uploadMedia(req.file);
        return res.success(201, UPLOAD_MESSAGE.UPLOAD_MEDIA_SUCCESS, result);
    }
}

export const uploadController = new UploadController();