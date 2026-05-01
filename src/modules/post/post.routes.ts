import { Router } from 'express';
import { postController } from './controller/post.controller';

const postRouter = Router();

postRouter.get('/', postController.list);
postRouter.post('/', postController.create);

export default postRouter;
