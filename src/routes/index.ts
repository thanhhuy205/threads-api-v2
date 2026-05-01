import healthRouter from '@/modules/health/health.routes';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);

export default router;