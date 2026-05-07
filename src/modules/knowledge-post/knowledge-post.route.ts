import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { knowledgePostController } from './controller/knowledge-post.controller';
import { createKnowledgePostRequestSchema, getKnowledgePostQuerySchema, knowledgePostIdParamsSchema } from './dto/request/knowledge-post.request';

const knowledgePostRouter = Router();

knowledgePostRouter.get('/', validate(getKnowledgePostQuerySchema, 'query'), knowledgePostController.getAll);
knowledgePostRouter.use(authorization);
knowledgePostRouter.post('/', validate(createKnowledgePostRequestSchema), knowledgePostController.create);
knowledgePostRouter.delete('/:id', validate(knowledgePostIdParamsSchema, 'params'), knowledgePostController.delete);

export default knowledgePostRouter;
