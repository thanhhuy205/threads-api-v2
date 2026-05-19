import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { questController } from './controller/quest.controller';
import { claimQuestParamsSchema } from './dto/request/claim-quest.params.dto';

const questRouter = Router();

questRouter.use(authorization);

questRouter.get('/daily', questController.getDailyQuests);
questRouter.post('/:questId/claim', validate(claimQuestParamsSchema, 'params'), questController.claimQuest);

export default questRouter;
