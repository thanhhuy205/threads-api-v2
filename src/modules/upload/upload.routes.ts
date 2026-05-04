import { memoryUpload } from '@/middlewares/multer';
import { resizeForThreads } from '@/middlewares/shape';
import { Router } from 'express';
import { uploadController } from './controller/upload.controller';

const uploadRouter = Router();

uploadRouter.post('/avatar', memoryUpload.single('file'), resizeForThreads, uploadController.uploadAvatar);
uploadRouter.post('/media', memoryUpload.array('medias', 5), uploadController.uploadMedia);

export default uploadRouter;