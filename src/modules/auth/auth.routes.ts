import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { authController } from './controller/auth.controller';
import { forgotPasswordSchema } from './dto/request/forgot-password.request.dto';
import { loginSchema } from './dto/request/login.request.dto';
import { logoutSchema } from './dto/request/logout.request.dto';
import { refreshTokenSchema } from './dto/request/refresh-token.request.dto';
import { registerSchema } from './dto/request/register.request.dto';
import { resetPasswordSchema } from './dto/request/reset-password.request.dto';
import { validateEmailSchema } from './dto/request/validate-email.request.dto';
import { validateTokenSchema } from './dto/request/validate-token.request.dto';
import { validateUsernameSchema } from './dto/request/validate-username.request.dto';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
authRouter.get('/me', authorization, authController.me);
authRouter.post('/logout', validate(logoutSchema), authController.logout);
authRouter.post('/resend-verify-email', authorization, authController.resendVerifyEmail);
authRouter.post('/verify-email', validate(validateTokenSchema), authController.verifyEmail);
authRouter.post('/validate/email', validate(validateEmailSchema), authController.validateEmail);
authRouter.post('/validate/username', validate(validateUsernameSchema), authController.validateUsername);
authRouter.get('/reset-password/validate', validate(validateTokenSchema, 'query'), authController.validateResetPasswordToken);
authRouter.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default authRouter;
