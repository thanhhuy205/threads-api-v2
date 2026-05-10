import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userController } from './controller/user.controller';
import { followersQuerySchema } from './dto/request/followers.query.dto';

const userRouter = Router();

userRouter.use(authorization);
userRouter.get('/followers', validate(followersQuerySchema, 'query'), userController.getFollower);

export default userRouter;
