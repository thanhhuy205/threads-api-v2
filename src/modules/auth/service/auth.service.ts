import configService from '@/config/config';
import { comparePassword, hashPassword } from '@/modules/auth/util/hasher-password';
import { hasherToken } from '@/modules/auth/util/hasher-token';
import { TokenPairResponse } from '@/modules/jwt/dto/response/token-pair.response';
import { jwtService } from '@/modules/jwt/service/jwt.service';
import { userRepository } from '@/modules/user/repository/user.repository';
import { ensureRedisConnection } from '@/providers/redis.provider';
import ms, { StringValue } from 'ms';
import type { ForgotPasswordDto } from '../dto/request/forgot-password.request.dto';
import type { LoginDto } from '../dto/request/login.request.dto';
import type { LogoutDto } from '../dto/request/logout.request.dto';
import type { RefreshTokenDto } from '../dto/request/refresh-token.request.dto';
import type { RegisterDto } from '../dto/request/register.request.dto';
import type { ResetPasswordDto } from '../dto/request/reset-password.request.dto';
import type { UpdateProfileDto } from '../dto/request/update-profile.request.dto';
import type { ValidateEmailDto } from '../dto/request/validate-email.request.dto';
import type { ValidateTokenDto } from '../dto/request/validate-token.request.dto';
import type { ValidateUsernameDto } from '../dto/request/validate-username.request.dto';
import { AuthMeResponseDto, authResponse, AuthSessionResponseDto } from '../dto/response/auth.response';
import type { ForgotPasswordResponseDto } from '../dto/response/forgot-password.response.dto';
import type { UpdateProfileDataDto } from '../dto/response/update-profile.response.dto';
import type { ValidateTokenResponseDto } from '../dto/response/validate-token.response.dto';
import type { ValidateUserResponseDto } from '../dto/response/validate-user.response.dto';
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

    async forgotPassword(payload: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
        
        return {
            email: payload.email,
        };
    }

    async updateProfile(userId: string, payload: UpdateProfileDto): Promise<UpdateProfileDataDto> {
        return {
            updated: Boolean(userId || payload),
        };
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

    async resendVerifyEmail(userId?: string): Promise<void> {
        return;
    }

    async verifyEmail(payload: ValidateTokenDto): Promise<void> {
        return;
    }

    async validateEmail(payload: ValidateEmailDto): Promise<ValidateUserResponseDto> {
        return {
            available: true,
        };
    }

    async validateUsername(payload: ValidateUsernameDto): Promise<ValidateUserResponseDto> {
        return {
            available: true,
        };
    }

    async validateResetPasswordToken(token: string): Promise<ValidateTokenResponseDto> {
        return {
            valid: true,
        };
    }

    async resetPassword(payload: ResetPasswordDto): Promise<void> {
        return;
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
