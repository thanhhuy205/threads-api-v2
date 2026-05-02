import { comparePassword, hashPassword } from '@/modules/auth/util/hasher-password';
import { TokenPairResponse } from '@/modules/jwt/dto/response/token-pair.response';
import { jwtService } from '@/modules/jwt/service/jwt.service';
import { userRepository } from '@/modules/user/repository/user.repository';
import { ensureRedisConnection } from '@/providers/redis.provider';
import crypto from 'crypto';
import { LoginDto, LogoutDto, RefreshTokenDto, RegisterDto } from '../dto/request/auth.request';
import { AuthMeResponseDto, authResponse, AuthSessionResponseDto } from '../dto/response/auth.response';
import { authRepository } from '../repository/auth.repository';

type SessionMetadata = {
    ip: string;
    userAgent: string;
};

class AuthService {
    async register(payload: RegisterDto, metadata: SessionMetadata): Promise<AuthSessionResponseDto> {
        const password = hashPassword(payload.password);
        const user = await authRepository.createUser({ ...payload, password });
        const tokenPair = await jwtService.generateTokenPair({
            userId: user.id,
            status: user.status,
        });
        await authRepository.createRefreshToken({
            userId: user.id,
            token: crypto.createHash('sha256').update(tokenPair.refreshToken).digest('hex'),
            sessionId: tokenPair.sessionId,
            expireAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
            ip: metadata.ip,
            userAgent: metadata.userAgent,
        });

        return authResponse.toResponse({
            type: 'auth',
            user,
            ...tokenPair,
        });
    }

    async login(payload: LoginDto, metadata: SessionMetadata): Promise<AuthSessionResponseDto | null> {
        const user = await authRepository.findUserByLogin(payload.login);

        const isPasswordValid = user && user.password ? comparePassword(payload.password, user.password) : false;
        if (!user || !isPasswordValid) {
            return null;
        }

        const tokenPair = await jwtService.generateTokenPair({
            userId: user.id,
            status: user.status,
        });

        await authRepository.createRefreshToken({
            userId: user.id,
            token: crypto.createHash('sha256').update(tokenPair.refreshToken).digest('hex'),
            sessionId: tokenPair.sessionId,
            expireAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
            ip: metadata.ip,
            userAgent: metadata.userAgent,
        });

        return authResponse.toResponse({
            type: 'auth',
            user,
            ...tokenPair,
        });
    }

    async refreshToken(payload: RefreshTokenDto, metadata: SessionMetadata): Promise<TokenPairResponse | null> {
        const hashedToken = crypto.createHash('sha256').update(payload.refreshToken).digest('hex');
        const refreshToken = await authRepository.findRefreshTokenByToken(hashedToken);

        if (!refreshToken || refreshToken.revokedAt) {
            return null;
        }

        const now = new Date();
        if (refreshToken.expireAt < now) {
            await authRepository.revokeRefreshTokenById(refreshToken.id, now);
            return null;
        }

        const user = await userRepository.findById(refreshToken.userId);
        if (!user) {
            return null;
        }

        await authRepository.revokeRefreshTokenById(refreshToken.id, now);

        const tokenPair = await jwtService.generateTokenPair({
            userId: refreshToken.userId,
            sessionId: refreshToken.sessionId,
            status: user.status,
        });

        await authRepository.createRefreshToken({
            userId: refreshToken.userId,
            token: crypto.createHash('sha256').update(tokenPair.refreshToken).digest('hex'),
            sessionId: refreshToken.sessionId,
            expireAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
            ip: metadata.ip,
            userAgent: metadata.userAgent,
        });

        return tokenPair;
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
