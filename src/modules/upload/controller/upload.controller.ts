import { UPLOAD_MESSAGE } from '@/constants/message';
import { Request, Response } from 'express';
import type { UploadAvatarDto } from '../dto/request/upload-avatar.request.dto';
import { uploadService } from '../service/upload.service';

class UploadController {
    async uploadAvatar(req: Request<{}, {}, UploadAvatarDto>, res: Response) {
        const result = await uploadService.uploadAvatar(req.file!);
        return res.success(201, UPLOAD_MESSAGE.UPLOAD_AVATAR_SUCCESS, result);
    }

    async uploadMedia(req: Request, res: Response) {
        const files = (req.files as Express.Multer.File[] | undefined) ?? [];
        const result = await uploadService.uploadMedia(files);
        return res.success(201, UPLOAD_MESSAGE.UPLOAD_MEDIA_SUCCESS, result);
    }
    async getUploadVideosUrl(req: Request, res: Response) {
        const result = await uploadService.getUploadVideosUrl();
        return res.success(201, UPLOAD_MESSAGE.UPLOAD_MEDIA_SUCCESS, result);
    }
}
export const uploadController = new UploadController();