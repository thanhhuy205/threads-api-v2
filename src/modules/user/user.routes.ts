import { authorization } from '@/middlewares/auth';
import { Router } from 'express';
import { userIntentController } from './controller/user-intent.controller';

const userRouter = Router();

userRouter.use(authorization);

userRouter.get('/feed-intent', userIntentController.getFeedIntent);
userRouter.post('/feed-intent', userIntentController.createFeedIntent);
userRouter.patch('/feed-intent', userIntentController.updateFeedIntent);
userRouter.delete('/feed-intent', userIntentController.deleteFeedIntent);

export default userRouter;