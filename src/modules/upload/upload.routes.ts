import { authorization } from '@/middlewares/auth';
import { memoryUpload } from '@/middlewares/multer';
import { resizeForThreads } from '@/middlewares/shape';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { uploadController } from './controller/upload.controller';
import { uploadMediaSchema } from './dto/request/upload-media.request.dto';

const uploadRouter = Router();

uploadRouter.post('/avatar', memoryUpload.single('file'), resizeForThreads, uploadController.uploadAvatar);
uploadRouter.post('/media', authorization, validate(uploadMediaSchema), memoryUpload.single('file'), resizeForThreads, uploadController.uploadMedia);

export default uploadRouter;