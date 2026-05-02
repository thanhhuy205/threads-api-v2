import { authService } from '@/modules/auth/service/auth.service';
import { Request, Response } from 'express';
import type { ForgotPasswordDto } from '../dto/request/forgot-password.request.dto';
import type { LoginDto } from '../dto/request/login.request.dto';
import type { RefreshTokenDto } from '../dto/request/refresh-token.request.dto';
import type { RegisterDto } from '../dto/request/register.request.dto';
import type { ResetPasswordDto } from '../dto/request/reset-password.request.dto';
import type { UpdateProfileDto } from '../dto/request/update-profile.request.dto';
import type { ValidateEmailDto } from '../dto/request/validate-email.request.dto';
import type { ValidateTokenDto } from '../dto/request/validate-token.request.dto';
import type { ValidateUsernameDto } from '../dto/request/validate-username.request.dto';

class AuthController {
    async register(req: Request<{}, {}, RegisterDto>, res: Response) {
        const user = await authService.register(req.body, {
            ip: req.ip ?? 'unknown',
            userAgent: req.headers['user-agent']?.toString() ?? 'unknown',
        });
        return res.success(201, 'Register success', user);
    }

    async login(req: Request<{}, {}, LoginDto>, res: Response) {
        const user = await authService.login(req.body, {
            ip: req.ip ?? 'unknown',
            userAgent: req.headers['user-agent']?.toString() ?? 'unknown',
        });

        if (!user) {
            return res.error(401, 'Invalid credentials');
        }

        return res.success(200, 'Login success', user);
    }

    async forgotPassword(req: Request<{}, {}, ForgotPasswordDto>, res: Response) {
        const result = await authService.forgotPassword(req.body);
        return res.success(200, 'Forgot password success', result);
    }

    async updateProfile(req: Request<{}, {}, UpdateProfileDto>, res: Response) {
        const userId = req.user?.sub;

        if (!userId) {
            return res.error(401, 'TOKEN_INVALID');
        }

        const result = await authService.updateProfile(userId, req.body);
        return res.success(200, 'Update profile success', result);
    }

    async refreshToken(req: Request<{}, {}, RefreshTokenDto>, res: Response) {
        const tokenPair = await authService.refreshToken(req.body, {
            ip: req.ip ?? 'unknown',
            userAgent: req.headers['user-agent']?.toString() ?? 'unknown',
        });

        if (!tokenPair) {
            return res.error(401, 'TOKEN_INVALID');
        }

        return res.success(200, 'Refresh token success', tokenPair);
    }

    async resendVerifyEmail(req: Request, res: Response) {
        await authService.resendVerifyEmail(req.user?.sub);
        return res.success(200, 'Resend verify email success');
    }

    async verifyEmail(req: Request<{}, {}, ValidateTokenDto>, res: Response) {
        await authService.verifyEmail(req.body);
        return res.success(200, 'Verify email success');
    }

    async validateEmail(req: Request<{}, {}, ValidateEmailDto>, res: Response) {
        const result = await authService.validateEmail(req.body);
        return res.success(200, 'Validate email success', result);
    }

    async validateUsername(req: Request<{}, {}, ValidateUsernameDto>, res: Response) {
        const result = await authService.validateUsername(req.body);
        return res.success(200, 'Validate username success', result);
    }

    async validateResetPasswordToken(req: Request, res: Response) {
        const query = req.query_parsed as ValidateTokenDto;
        const result = await authService.validateResetPasswordToken(query.token);
        return res.success(200, 'Validate reset password token success', result);
    }

    async resetPassword(req: Request<{}, {}, ResetPasswordDto>, res: Response) {
        await authService.resetPassword(req.body);
        return res.success(200, 'Reset password success');
    }

    async me(req: Request, res: Response) {
        const userId = req.user?.sub;

        if (!userId) {
            return res.error(401, 'TOKEN_INVALID');
        }

        const user = await authService.me(userId);

        if (!user) {
            return res.error(404, 'User not found');
        }

        return res.success(200, 'Get me success', user);
    }

    async logout(req: Request, res: Response) {
        await authService.logout(req.body);
        return res.success(200, 'Logout success');
    }
}

export const authController = new AuthController();
