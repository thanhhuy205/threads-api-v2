import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userController } from './controller/user.controller';
import { userIdParamsSchema } from './dto/request/user-id.params.dto';

const usersRouter = Router();

usersRouter.get('/:id/followers', validate(userIdParamsSchema, 'params'), userController.getFollower);
usersRouter.post('/:id/follow', authorization, validate(userIdParamsSchema, 'params'), userController.followUser);

export default usersRouter;