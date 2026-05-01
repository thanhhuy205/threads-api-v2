import { Router } from 'express';
import { healthCheck, readinessCheck } from './health.controller';

const healthRouter = Router();

healthRouter.get('/', healthCheck);
healthRouter.get('/ready', readinessCheck);

export default healthRouter;