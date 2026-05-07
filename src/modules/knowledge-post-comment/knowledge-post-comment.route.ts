import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { knowledgePostCommentController } from './controller/knowledge-post-comment.controller';
import {
    createKnowledgePostCommentRequestSchema,
    getKnowledgePostCommentQuerySchema,
    knowledgePostCommentIdParamsSchema,
    knowledgePostIdParamsSchema,
} from './dto/request/knowledge-post-comment.request';

const knowledgePostCommentRouter = Router();

knowledgePostCommentRouter.use(authorization);

knowledgePostCommentRouter.post(
    '/:knowledgePostId/replies',
    validate(knowledgePostIdParamsSchema, 'params'),
    validate(createKnowledgePostCommentRequestSchema),
    knowledgePostCommentController.createReply,
);

knowledgePostCommentRouter.get(
    '/:knowledgePostId/replies',
    validate(knowledgePostIdParamsSchema, 'params'),
    validate(getKnowledgePostCommentQuerySchema, 'query'),
    knowledgePostCommentController.getReplies,
);

knowledgePostCommentRouter.get(
    '/:knowledgePostId/replies/:commentId',
    validate(knowledgePostCommentIdParamsSchema, 'params'),
    knowledgePostCommentController.getReplyById,
);

export default knowledgePostCommentRouter;
