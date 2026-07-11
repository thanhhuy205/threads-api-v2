import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userController } from './controller/user.controller';
import { usernameParamsSchema } from './dto/request/username.params.dto';

import { followersQuerySchema } from './dto/request/followers.query.dto';

const userFollowRouter = Router();

userFollowRouter.get('/:username/followers', validate(usernameParamsSchema, 'params'), validate(followersQuerySchema, 'query'), userController.getFollower);
userFollowRouter.get('/:username/following', validate(usernameParamsSchema, 'params'), validate(followersQuerySchema, 'query'), userController.getFollowing);
userFollowRouter.post('/:username/friend-request', authorization, validate(usernameParamsSchema, 'params'), userController.sendFriendRequest);
userFollowRouter.post('/:username/follower', authorization, validate(usernameParamsSchema, 'params'), userController.follower);

export default userFollowRouter;
