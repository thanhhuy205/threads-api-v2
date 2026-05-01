import { healthController } from '@/modules/health/health.controller';
import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/', healthController.getHealth);

export default healthRouter;