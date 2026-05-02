import { uploadService } from '@/modules/upload/service/upload.service';
import { Request, Response } from 'express';
import type { UploadAvatarDto } from '../dto/request/upload-avatar.request.dto';
import type { UploadMediaDto } from '../dto/request/upload-media.request.dto';

class UploadController {
    async uploadAvatar(req: Request<{}, {}, UploadAvatarDto>, res: Response) {
        const result = await uploadService.uploadAvatar(req.body);
        return res.success(201, 'Upload avatar success', result);
    }

    async uploadMedia(req: Request<{}, {}, UploadMediaDto>, res: Response) {
        const result = await uploadService.uploadMedia(req.body);
        return res.success(201, 'Upload media success', result);
    }
}

export const uploadController = new UploadController();