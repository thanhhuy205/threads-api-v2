import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { postController } from './controller/post.controller';
import { createPostSchema } from './dto/post.dto';
import {
    newsFeedQuerySchema,
    paginationQuerySchema,
    postIdParamsSchema,
    reportSchema,
    userIdParamsSchema,
} from './dto/request/post.request';

const postRouter = Router();

postRouter.get('/news-feed', validate(newsFeedQuerySchema, 'query'), postController.getNewsFeedController);
postRouter.get('/search', postController.search);
postRouter.get('/:postId/replies', validate(postIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getReplies);
postRouter.get('/:postId', validate(postIdParamsSchema, 'params'), postController.getThread);

postRouter.use(authorization);

postRouter.get('/me', validate(paginationQuerySchema, 'query'), postController.getPostMe);
postRouter.get('/:userId/repost', validate(userIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getRepost);
postRouter.get('/:userId/quote', validate(userIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getQuote);

postRouter.post('/', validate(createPostSchema), postController.createPostController);

postRouter.post('/:postId/reply', validate(postIdParamsSchema, 'params'), validate(createPostSchema), postController.replyPost);
postRouter.post('/:postId/like', validate(postIdParamsSchema, 'params'), postController.likePost);
postRouter.post('/:postId/repost', validate(postIdParamsSchema, 'params'), postController.repostPost);
postRouter.post('/:postId/quote', validate(postIdParamsSchema, 'params'), validate(createPostSchema), postController.quotePost);
postRouter.post('/:postId/save', validate(postIdParamsSchema, 'params'), postController.savePost);
postRouter.post('/:postId/hide', validate(postIdParamsSchema, 'params'), postController.hidePost);
postRouter.post('/:postId/report', validate(postIdParamsSchema, 'params'), validate(reportSchema), postController.reportPost);
postRouter.delete('/:postId', validate(postIdParamsSchema, 'params'), postController.deletePost);

export default postRouter;
