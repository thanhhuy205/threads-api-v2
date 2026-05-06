import { authorization } from '@/middlewares/auth';
import { Router } from 'express';

const userRouter = Router();

userRouter.use(authorization);

export default userRouter;
