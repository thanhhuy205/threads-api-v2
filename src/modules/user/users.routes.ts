import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userController } from './controller/user.controller';
import { usernameParamsSchema } from './dto/request/username.params.dto';

const usersRouter = Router();

usersRouter.get('/me/karma', authorization, userController.getMyKarma);
usersRouter.get('/me/badges', authorization, userController.getMyBadges);
usersRouter.get('/:username', validate(usernameParamsSchema, 'params'), userController.getByUsername);

export default usersRouter;
