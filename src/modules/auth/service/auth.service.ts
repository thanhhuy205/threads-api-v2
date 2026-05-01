import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { authRepository, AuthUser } from '../repo/auth.repository';

class AuthService {
    async register(payload: RegisterDto): Promise<AuthUser> {
        return authRepository.createUser(payload);
    }

    async login(payload: LoginDto): Promise<AuthUser | null> {
        const user = await authRepository.findUserByLogin(payload.login);

        if (!user) {
            return null;
        }

        return user;
    }
}

export const authService = new AuthService();
