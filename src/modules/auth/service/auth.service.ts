import { jwtService } from '@/modules/jwt/service/jwt.service';
import { LoginDto, RegisterDto } from '../dto/request/auth.request';
import { authResponse, AuthResponseDto } from '../dto/response/auth.response';
import { authRepository } from '../repo/auth.repository';

class AuthService {
    async register(payload: RegisterDto): Promise<AuthResponseDto> {
        const user = await authRepository.createUser(payload);
        const tokenPair = await jwtService.generateTokenPair({
            userId: user.id,
            status: user.status,
        });

        return authResponse.toResponse({
            user,
            ...tokenPair,
        });
    }

    async login(payload: LoginDto): Promise<AuthResponseDto | null> {
        const user = await authRepository.findUserByLogin(payload.login);

        if (!user) {
            return null;
        }

        const tokenPair = await jwtService.generateTokenPair({
            userId: user.id,
            status: user.status,
        });

        return authResponse.toResponse({
            user,
            ...tokenPair,
        });
    }
}



export const authService = new AuthService();