import authRouter from '@/modules/auth/auth.routes';
import healthRouter from '@/modules/health/health.routes';
import postRouter from '@/modules/post/post.routes';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRouter);
router.use('/health', healthRouter);
router.use('/posts', postRouter);

export default router;