import { authorization } from '@/middlewares/auth';
import { memoryUpload } from '@/middlewares/multer';
import { resizeForThreads } from '@/middlewares/shape';
import { Router } from 'express';
import { uploadController } from './controller/upload.controller';

const uploadRouter = Router();

uploadRouter.post('/avatar', memoryUpload.single('file'), resizeForThreads, uploadController.uploadAvatar);
uploadRouter.post('/media', authorization, memoryUpload.array('medias', 5), resizeForThreads, uploadController.uploadMedia);


export default uploadRouter;