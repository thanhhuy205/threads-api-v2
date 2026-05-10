import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { userController } from './controller/user.controller';
import { usernameParamsSchema } from './dto/request/username.params.dto';

const usersRouter = Router();

usersRouter.get('/:username', validate(usernameParamsSchema, 'params'), userController.getByUsername);

export default usersRouter;
