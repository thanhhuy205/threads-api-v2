import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { internalController } from './controller/internal.controller';
import { judgeCompleteBodySchema } from './dto/request/judge-complete.dto';

const internalRouter = Router();

internalRouter.use(authorization);

internalRouter.post('/judge-complete', validate(judgeCompleteBodySchema), internalController.judgeComplete);

export default internalRouter;
