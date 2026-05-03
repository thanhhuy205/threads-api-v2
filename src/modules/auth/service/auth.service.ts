import configService from '@/config/config';
import { NotFoundException } from '@/errors/error';
import { verificationRepository } from '@/modules/auth/repository/verification.repository';
import { comparePassword, hashPassword } from '@/modules/auth/util/hasher-password';
import { hasherToken } from '@/modules/auth/util/hasher-token';
import { bloomProducer } from '@/modules/job/bloom/producer/bloom.producer';
import { emailProducer } from '@/modules/job/email/producer/email.producer';
import { TokenPairResponse } from '@/modules/jwt/dto/response/token-pair.response';
import { jwtService } from '@/modules/jwt/service/jwt.service';
import { userRepository } from '@/modules/user/repository/user.repository';
import { ensureRedisConnection } from '@/providers/redis.provider';
import { VerificationCodeType } from '@prisma/client';
import crypto from 'crypto';
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

        await Promise.all(
            [
                this.createRefreshToken(tokenPair.refreshToken, user.id, tokenPair.sessionId, metadata),
                bloomProducer.addUserNameAndEmailToBloom({
                    email: user.email,
                    userName: user.username,
                })
            ]
        )

        return authResponse.toResponse({
            type: 'auth',
            user,
            ...tokenPair,
        });
    }

    async forgotPassword(payload: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
        const user = await authRepository.findUserByEmail(payload.email);
        if (!user) {
            throw new NotFoundException('Email or username not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = hasherToken(token);


        await Promise.all([emailProducer.sendForgotPasswordEmail({
            userId: user.id,
            email: user.email,
            token,
        }),

        verificationRepository.create({
            userId: user.id,
            tokenHash: hashedToken,
            type: VerificationCodeType.FORGOT_PASSWORD
        })]);
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
        const hashedToken = hasherToken(payload.token);
        const verificationRecord = await verificationRepository.findByTokenHashAndType(hashedToken, VerificationCodeType.FORGOT_PASSWORD);
        if (!verificationRecord) {
            throw new NotFoundException('Invalid token');
        }

        if (verificationRecord.expiresAt < new Date()) {
            throw new NotFoundException('Token expired');
        }

        const user = await authRepository.findUserByEmail(payload.email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (payload.password !== payload.confirmPassword) {
            throw new NotFoundException('Password and confirm password do not match');
        }

        const newPassword = hashPassword(payload.password);
        await authRepository.updatePassword(user.id, newPassword);
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
