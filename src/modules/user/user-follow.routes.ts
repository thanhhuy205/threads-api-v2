import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userController } from './controller/user.controller';
import { userIdParamsSchema } from './dto/request/user-id.params.dto';

const userFollowRouter = Router();

userFollowRouter.post('/:id/follow', authorization, validate(userIdParamsSchema, 'params'), userController.unFollowUser);

export default userFollowRouter;