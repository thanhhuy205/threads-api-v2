import { Request, Response } from 'express';
import { parseLoginDto, parseRegisterDto } from '../dto/auth.dto';
import { authService } from '../service/auth.service';

class AuthController {
    async register(req: Request, res: Response) {
        const parsed = parseRegisterDto(req.body);

        if (!parsed.success) {
            return res.error(422, 'Invalid payload', parsed.error.flatten());
        }

        const user = await authService.register(parsed.data);

        return res.success(201, 'Register success', user);
    }

    async login(req: Request, res: Response) {
        const parsed = parseLoginDto(req.body);

        if (!parsed.success) {
            return res.error(422, 'Invalid payload', parsed.error.flatten());
        }

        const user = await authService.login(parsed.data);

        if (!user) {
            return res.error(401, 'Invalid credentials');
        }

        return res.success(200, 'Login success', user);
    }
}

export const authController = new AuthController();
