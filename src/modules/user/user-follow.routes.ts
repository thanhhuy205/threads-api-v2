import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userController } from './controller/user.controller';
import { usernameParamsSchema } from './dto/request/username.params.dto';

const userFollowRouter = Router();

userFollowRouter.post('/:username/follower', authorization, validate(usernameParamsSchema, 'params'), userController.follower);

export default userFollowRouter;
