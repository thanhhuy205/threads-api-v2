import { swaggerDocument } from '@/config/swagger';
import authRouter from '@/modules/auth/auth.routes';
import circleRouter from '@/modules/circle/circle.routes';
import healthRouter from '@/modules/health/health.routes';
import notificationRouter from '@/modules/notification/notification.route';
import postRouter from '@/modules/post/post.routes';
import sseRouter from '@/modules/sse/sse.route';
import uploadRouter from '@/modules/upload/upload.routes';
import userFollowRouter from '@/modules/user/user-follow.routes';
import userRouter from '@/modules/user/user.routes';
import usersRouter from '@/modules/user/users.routes';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router = Router();
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/auth', authRouter);
router.use('/circle', circleRouter);
router.use('/health', healthRouter);
router.use('/me', userRouter);
router.use('/users', usersRouter);
router.use('/user', userFollowRouter);
router.use('/upload', uploadRouter);
router.use('/posts', postRouter);
router.use('/notification', notificationRouter);
router.use('/sse', sseRouter);

export default router;