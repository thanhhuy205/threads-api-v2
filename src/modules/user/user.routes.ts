import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userIntentController } from './controller/user-intent.controller';
import { createFeedIntentSchema } from './dto/feed-intent.dto';

const userRouter = Router();

userRouter.use(authorization);

userRouter.get('/feed-intent', userIntentController.getFeedIntent);
userRouter.post('/feed-intent', validate(createFeedIntentSchema), userIntentController.createFeedIntent);
userRouter.patch('/feed-intent', userIntentController.updateFeedIntent);
userRouter.delete('/feed-intent', userIntentController.deleteFeedIntent);

export default userRouter;
