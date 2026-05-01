import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { authController } from './controller/auth.controller';
import { loginSchema, registerSchema } from './dto/request/auth.request';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);

export default authRouter;
