import configService from '@/config/config';
import { comparePassword, hashPassword } from '@/modules/auth/util/hasher-password';
import { hasherToken } from '@/modules/auth/util/hasher-token';
import { TokenPairResponse } from '@/modules/jwt/dto/response/token-pair.response';
import { jwtService } from '@/modules/jwt/service/jwt.service';
import { userRepository } from '@/modules/user/repository/user.repository';
import { ensureRedisConnection } from '@/providers/redis.provider';
import ms, { StringValue } from 'ms';
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

        await this.createRefreshToken(tokenPair.refreshToken, user.id, tokenPair.sessionId, metadata);

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

        await this.createRefreshToken(tokenPair.refreshToken, user.id, tokenPair.sessionId, metadata);

        return authResponse.toResponse({
            type: 'auth',
            user,
            ...tokenPair,
        });
    }

    async refreshToken(payload: RefreshTokenDto, metadata: SessionMetadata): Promise<TokenPairResponse | null> {
        const hashedToken = hasherToken(payload.refreshToken);
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

        await this.createRefreshToken(tokenPair.refreshToken, user.id, tokenPair.sessionId, metadata);

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
        await redisClient.set(`bl:at:${payload.accessToken}`, 15 * 60); // Blacklist access token for 15 minutes

        const hashedToken = hasherToken(payload.refreshToken);
        const refreshToken = await authRepository.findRefreshTokenByToken(hashedToken);
        if (refreshToken) {
            await authRepository.revokeRefreshTokenById(refreshToken.id, new Date());
        }
    }

    private async createRefreshToken(refreshToken: string, userId: string, sessionId: string, metadata: SessionMetadata) {
        const createdRefreshToken = await authRepository.createRefreshToken({
            userId: userId,
            token: hasherToken(refreshToken),
            sessionId: sessionId,
            expireAt: new Date(Date.now() + ms(configService.REFRESH_TOKEN_EXPIRES_IN as StringValue)),
            ip: metadata.ip,
            userAgent: metadata.userAgent,
        });

        return createdRefreshToken;
    }
}


export const authService = new AuthService();
