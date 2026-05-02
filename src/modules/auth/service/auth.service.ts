import { comparePassword, hashPassword } from '@/modules/auth/util/hasher-password';
import { jwtService } from '@/modules/jwt/service/jwt.service';
import { userRepository } from '@/modules/user/repository/user.repository';
import { ensureRedisConnection } from '@/providers/redis.provider';
import { LoginDto, LogoutDto, RegisterDto } from '../dto/request/auth.request';
import { AuthMeResponseDto, authResponse, AuthSessionResponseDto } from '../dto/response/auth.response';
import { authRepository } from '../repository/auth.repository';

class AuthService {
    async register(payload: RegisterDto): Promise<AuthSessionResponseDto> {
        const password = hashPassword(payload.password);
        const user = await authRepository.createUser({ ...payload, password });
        const tokenPair = await jwtService.generateTokenPair({
            userId: user.id,
            status: user.status,
        });

        return authResponse.toResponse({
            type: 'auth',
            user,
            ...tokenPair,
        });
    }

    async login(payload: LoginDto): Promise<AuthSessionResponseDto | null> {
        const user = await authRepository.findUserByLogin(payload.login);

        const isPasswordValid = user && user.password ? comparePassword(payload.password, user.password) : false;
        if (!user || !isPasswordValid) {
            return null;
        }

        const tokenPair = await jwtService.generateTokenPair({
            userId: user.id,
            status: user.status,
        });

        return authResponse.toResponse({
            type: 'auth',
            user,
            ...tokenPair,
        });
    }

    async me(userId: string): Promise<AuthMeResponseDto | null> {
        const user = await userRepository.findById(userId);
        if (!user) {
            return null;
        }

        return authResponse.toResponse({
            type: 'me',
            user,
        });
    }

    async logout(payload: LogoutDto): Promise<void> {
        const redisClient = await ensureRedisConnection();
        await redisClient.set(`bl:at:${payload.accessToken}`, '1');
    }
}



export const authService = new AuthService();