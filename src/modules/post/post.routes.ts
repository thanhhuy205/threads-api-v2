import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { postController } from './controller/post.controller';
import { createPostSchema } from './dto/post.dto';
import {
    newsFeedQuerySchema,
    paginationQuerySchema,
    postIdParamsSchema,
    userIdParamsSchema,
} from './dto/request/post.request';

const postRouter = Router();

postRouter.get('/news-feed', validate(newsFeedQuerySchema, 'query'), postController.getNewsFeedController);
postRouter.get('/:postId/replies', validate(postIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getReplies);

postRouter.use(authorization);

postRouter.get('/me', validate(paginationQuerySchema, 'query'), postController.getPostMe);
postRouter.get('/:userId/repost', validate(userIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getRepost);
postRouter.get('/:userId/quote', validate(userIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getQuote);

postRouter.post('/', validate(createPostSchema), postController.createPostController);

export default postRouter;
