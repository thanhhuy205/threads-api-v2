import { authorization } from '@/middlewares/auth';
import { notificationController } from '@/modules/notification/controller/notification.controller';
import { Router } from 'express';

const notificationRouter = Router();

notificationRouter.get('/welcome', authorization, notificationController.welcome);

export default notificationRouter;
