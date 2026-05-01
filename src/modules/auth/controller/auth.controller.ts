import { authService } from '@/modules/auth/service/auth.service';
import { Request, Response } from 'express';

class AuthController {
    async register(req: Request, res: Response) {
        const user = await authService.register(req.body);
        return res.success(201, 'Register success', user);
    }

    async login(req: Request, res: Response) {
        const user = await authService.login(req.body);

        if (!user) {
            return res.error(401, 'Invalid credentials');
        }

        return res.success(200, 'Login success', user);
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
