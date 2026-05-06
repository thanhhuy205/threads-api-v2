import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { knowledgeRankingController } from './controller/knowledge-ranking.controller';
import { createKnowledgeRankingRequestSchema, knowledgePostIdParamsSchema } from './dto/request/knowledge-ranking.request';

const knowledgeRankingRouter = Router();

knowledgeRankingRouter.use(authorization);

knowledgeRankingRouter.post('/postRanking', validate(createKnowledgeRankingRequestSchema), knowledgeRankingController.postRanking);
knowledgeRankingRouter.get('/:knowledgePostId', validate(knowledgePostIdParamsSchema, 'params'), knowledgeRankingController.getRanking);

export default knowledgeRankingRouter;
