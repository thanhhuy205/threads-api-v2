import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { uploadController } from './controller/upload.controller';
import { uploadAvatarSchema } from './dto/request/upload-avatar.request.dto';
import { uploadMediaSchema } from './dto/request/upload-media.request.dto';

const uploadRouter = Router();

uploadRouter.post('/avatar', authorization, validate(uploadAvatarSchema), uploadController.uploadAvatar);
uploadRouter.post('/media', authorization, validate(uploadMediaSchema), uploadController.uploadMedia);

export default uploadRouter;