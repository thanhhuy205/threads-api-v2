import { authService } from '@/modules/auth/service/auth.service';
import { Request, Response } from 'express';
import { LoginDto, RefreshTokenDto, RegisterDto } from '../dto/request/auth.request';

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
