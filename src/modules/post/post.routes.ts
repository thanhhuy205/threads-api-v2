import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { postController } from './controller/post.controller';
import { createPostSchema } from './dto/post.dto';

const postRouter = Router();

postRouter.get('/', postController.list);
postRouter.post('/', validate(createPostSchema), postController.create);

export default postRouter;
