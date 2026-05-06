import { authorization } from '@/middlewares/auth';
import { sseController } from '@/modules/sse/controller/sse.controller';
import { Router } from 'express';

const sseRouter = Router();

sseRouter.get('/event', authorization, sseController.connect);
export default sseRouter;