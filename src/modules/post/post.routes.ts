import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { postController } from './controller/post.controller';
import { createPostSchema } from './dto/post.dto';
import {
    newsFeedQuerySchema,
    paginationQuerySchema,
    publicIdParamsSchema,
    reportSchema,
    userIdParamsSchema,
} from './dto/request/post.request';

const postRouter = Router();

postRouter.get('/news-feed', validate(newsFeedQuerySchema, 'query'), postController.getNewsFeedController);
postRouter.get('/search', postController.search);
postRouter.get('/:publicId/replies', validate(publicIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getReplies);
postRouter.get('/:publicId', validate(publicIdParamsSchema, 'params'), postController.getThread);

postRouter.use(authorization);

postRouter.get('/me', validate(paginationQuerySchema, 'query'), postController.getPostMe);
postRouter.get('/:userId/repost', validate(userIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getRepost);
postRouter.get('/:userId/quote', validate(userIdParamsSchema, 'params'), validate(paginationQuerySchema, 'query'), postController.getQuote);

postRouter.post('/', validate(createPostSchema), postController.createPostController);

postRouter.post('/:publicId/reply', validate(publicIdParamsSchema, 'params'), validate(createPostSchema), postController.replyPost);
postRouter.post('/:publicId/like', validate(publicIdParamsSchema, 'params'), postController.likePost);
postRouter.post('/:publicId/repost', validate(publicIdParamsSchema, 'params'), postController.repostPost);
postRouter.post('/:publicId/quote', validate(publicIdParamsSchema, 'params'), validate(createPostSchema), postController.quotePost);
postRouter.post('/:publicId/save', validate(publicIdParamsSchema, 'params'), postController.savePost);
postRouter.post('/:publicId/hide', validate(publicIdParamsSchema, 'params'), postController.hidePost);
postRouter.post('/:publicId/report', validate(publicIdParamsSchema, 'params'), validate(reportSchema), postController.reportPost);
postRouter.delete('/:publicId', validate(publicIdParamsSchema, 'params'), postController.deletePost);

export default postRouter;
