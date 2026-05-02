import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { authController } from './controller/auth.controller';
import { loginSchema } from './dto/request/login.request.dto';
import { logoutSchema } from './dto/request/logout.request.dto';
import { refreshTokenSchema } from './dto/request/refresh-token.request.dto';
import { registerSchema } from './dto/request/register.request.dto';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
authRouter.get('/me', authorization, authController.me);
authRouter.post('/logout', validate(logoutSchema), authController.logout);

export default authRouter;
