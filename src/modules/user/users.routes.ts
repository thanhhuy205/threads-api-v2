import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userController } from './controller/user.controller';
import { userNameMentionQuerySchema, usernameParamsSchema } from './dto/request/username.params.dto';

const usersRouter = Router();
usersRouter.get(
    "/mention",
    validate(userNameMentionQuerySchema, "query"),
    userController.getUsernames,
);
usersRouter.get('/:username', validate(usernameParamsSchema, 'params'), userController.getByUsername);
usersRouter.use(authorization);



usersRouter.get('/me/karma', authorization, userController.getMyKarma);
usersRouter.get('/me/badges', authorization, userController.getMyBadges);



export default usersRouter;
