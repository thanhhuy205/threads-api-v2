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
}

export const authController = new AuthController();
