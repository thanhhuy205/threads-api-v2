import configService from "@/config/config";
import { redisKey } from "@/constants/resolve-key/redis-key";
import { NotFoundException } from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { roleRepository } from "@/modules/access-control/role/repository/role.repository";
import { userRoleRepository } from "@/modules/access-control/role/repository/user-role.repository";
import type { SessionMetadata } from "@/modules/auth/interfaces/session-metadata";
import { verificationRepository } from "@/modules/auth/repository/verification.repository";
import {
  comparePassword,
  hashPassword,
} from "@/modules/auth/util/hasher-password";
import { hasherToken } from "@/modules/auth/util/hasher-token";
import { bloomProducer } from "@/modules/job/bloom/producer/bloom.producer";
import { elasticProducer } from "@/modules/job/elastic-search/producer/elastic.producer";
import { emailProducer } from "@/modules/job/email/producer/email.producer";
import { TokenPairResponse } from "@/modules/jwt/dto/response/token-pair.response";
import { jwtService } from "@/modules/jwt/service/jwt.service";
import { userRepository } from "@/modules/user/repository/user.repository";
import { redisService } from "@/providers/redis.provider";
import { UserRoleType, VerificationCodeType } from "@prisma/client";
import crypto from "crypto";
import ms, { StringValue } from "ms";
import type { ForgotPasswordDto } from "../dto/request/forgot-password.request.dto";
import type { LoginDto } from "../dto/request/login.request.dto";
import type { LogoutDto } from "../dto/request/logout.request.dto";
import type { RefreshTokenDto } from "../dto/request/refresh-token.request.dto";
import type { RegisterDto } from "../dto/request/register.request.dto";
import type { ResetPasswordDto } from "../dto/request/reset-password.request.dto";
import type { UpdateProfileDto } from "../dto/request/update-profile.request.dto";
import type { ValidateEmailDto } from "../dto/request/validate-email.request.dto";
import type { ValidateTokenDto } from "../dto/request/validate-token.request.dto";
import type { ValidateUsernameDto } from "../dto/request/validate-username.request.dto";
import {
  AuthMeResponseDto,
  authResponse,
  AuthSessionResponseDto,
} from "../dto/response/auth.response";
import type { ForgotPasswordResponseDto } from "../dto/response/forgot-password.response.dto";
import type { UpdateProfileDataDto } from "../dto/response/update-profile.response.dto";
import type { ValidateTokenResponseDto } from "../dto/response/validate-token.response.dto";
import type { ValidateUserResponseDto } from "../dto/response/validate-user.response.dto";
import { authRepository } from "../repository/auth.repository";

class AuthService {
  async register(
    payload: RegisterDto,
    metadata: SessionMetadata,
  ): Promise<AuthSessionResponseDto> {
    const password = hashPassword(payload.password);
    const user = await authRepository.createUser({ ...payload, password });

    const role = await roleRepository.findByName(UserRoleType.USER);
    if (role) {
      await userRoleRepository.assignRole(user.id, role.id);
    }

    const tokenPair = await jwtService.generateTokenPair({
      userId: user.id,
      status: user.status,
      roles: [UserRoleType.USER],
    });

    await Promise.all([
      this.createRefreshToken(
        tokenPair.refreshToken,
        user.id,
        tokenPair.sessionId,
        metadata,
      ),
      bloomProducer.addUserNameAndEmailToBloom({
        email: user.email,
        userName: user.username,
      }),
      elasticProducer.addUserToElasticQueue({
        userId: user.id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        isVerified: Boolean(user.verifiedAt),
        createdAt: user.createdAt.toISOString(),
      }),
    ]);

    return authResponse.toResponse({
      type: "auth",
      user,
      ...tokenPair,
    });
  }

  async forgotPassword(
    payload: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const user = await authRepository.findUserByEmail(payload.email);
    if (!user) {
      throw new NotFoundException("Email or username not found");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = hasherToken(token);

    await Promise.all([
      emailProducer.sendForgotPasswordEmail({
        userId: user.id,
        email: user.email,
        token,
      }),

      verificationRepository.create({
        userId: user.id,
        tokenHash: hashedToken,
        type: VerificationCodeType.FORGOT_PASSWORD,
      }),
    ]);
    return {
      email: payload.email,
    };
  }

  async updateProfile(
    userId: string,
    payload: UpdateProfileDto,
  ): Promise<UpdateProfileDataDto> {
    return {
      updated: Boolean(userId || payload),
    };
  }

  async login(
    payload: LoginDto,
    metadata: SessionMetadata,
  ): Promise<AuthSessionResponseDto | null> {
    const user = await authRepository.findUserByLogin(payload.login);

    const isPasswordValid =
      user && user.password
        ? comparePassword(payload.password, user.password)
        : false;
    if (!user || !isPasswordValid) {
      return null;
    }

    const userRoles = await userRoleRepository.findByUserId(user.id);
    const roles = userRoles.map((ur) => ur.role.name as UserRoleType);

    const tokenPair = await jwtService.generateTokenPair({
      userId: user.id,
      status: user.status,
      roles: roles,
    });

    await this.createRefreshToken(
      tokenPair.refreshToken,
      user.id,
      tokenPair.sessionId,
      metadata,
    );

    return authResponse.toResponse({
      type: "auth",
      user,
      ...tokenPair,
    });
  }

  async resendVerifyEmail(originUrl: string, userId?: string): Promise<void> {
    const user = await userRepository.findById(userId ?? "");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const verificationRecord = await verificationRepository.findLatestByUserIdAndType(
      user.id,
      VerificationCodeType.VERIFY_ACCOUNT,
    );

    const recentVerificationRecord = verificationRecord ? verificationRecord[0] : null;

    if (recentVerificationRecord && recentVerificationRecord.expiresAt > new Date()) {
      throw new NotFoundException("A valid verification email has already been sent");
    }

    if (verificationRecord && verificationRecord.length >= 5) {
      throw new NotFoundException("You have reached the limit for resending verification email. Please try again later.");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = hasherToken(token);

    await Promise.all([
      emailProducer.sendVerifyEmail({
        userName: user.username,
        email: user.email,
        token,
        originUrl
      }),
      verificationRepository.create({
        userId: user.id,
        tokenHash: hashedToken,
        type: VerificationCodeType.VERIFY_ACCOUNT,
      }),
    ]);
  }

  async verifyEmail(payload: ValidateTokenDto): Promise<void> {
    const hashedToken = hasherToken(payload.token);
    const verificationRecord =
      await verificationRepository.findByTokenHashAndType(
        hashedToken,
        VerificationCodeType.VERIFY_ACCOUNT,
      );
    if (!verificationRecord) {
      throw new NotFoundException("Invalid token");
    }

    if (verificationRecord.expiresAt < new Date()) {
      throw new NotFoundException("Mã xac thực đã hết hạn");
    }

    await authRepository.updateVerifiedEmail(verificationRecord.userId);
    await redisService.del(redisKey.auth.me(verificationRecord.userId));
  }

  async validateEmail(
    payload: ValidateEmailDto,
  ): Promise<ValidateUserResponseDto> {
    const isExistingEmail = await redisService.bf.exists(
      redisKey.bloom.emails(),
      payload.email,
    );
    baseLogger.info(
      `Checked email: ${payload.email} in Bloom filter, exists: ${isExistingEmail}`,
    );
    return {
      available: !Boolean(isExistingEmail),
    };
  }

  async validateUsername(
    payload: ValidateUsernameDto,
  ): Promise<ValidateUserResponseDto> {
    const isExistingUsername = await redisService.bf.exists(
      redisKey.bloom.usernames(),
      payload.username,
    );
    baseLogger.info(
      `Checked username: ${payload.username} in Bloom filter, exists: ${isExistingUsername}`,
    );

    return {
      available: !Boolean(isExistingUsername),
    };
  }

  async validateResetPasswordToken(
    token: string,
  ): Promise<ValidateTokenResponseDto> {
    return {
      valid: true,
    };
  }

  async resetPassword(payload: ResetPasswordDto): Promise<void> {
    const hashedToken = hasherToken(payload.token);
    const verificationRecord =
      await verificationRepository.findByTokenHashAndType(
        hashedToken,
        VerificationCodeType.FORGOT_PASSWORD,
      );
    if (!verificationRecord) {
      throw new NotFoundException("Invalid token");
    }

    if (verificationRecord.expiresAt < new Date()) {
      throw new NotFoundException("Token expired");
    }

    const user = await authRepository.findUserByEmail(payload.email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (payload.password !== payload.confirmPassword) {
      throw new NotFoundException("Password and confirm password do not match");
    }

    const newPassword = hashPassword(payload.password);
    await authRepository.updatePassword(user.id, newPassword);
  }

  async refreshToken(
    payload: RefreshTokenDto,
    metadata: SessionMetadata,
  ): Promise<TokenPairResponse | null> {
    const hashedToken = hasherToken(payload.refreshToken);
    const refreshToken =
      await authRepository.findRefreshTokenByToken(hashedToken);
    if (!refreshToken || refreshToken.revokedAt) {
      return null;
    }

    const now = new Date();
    if (refreshToken.expireAt < now) {
      await authRepository.revokeRefreshTokenById(refreshToken.id, now);
      baseLogger.info(`Refresh token with id ${refreshToken.id} has expired and been revoked.`);
      return null;
    }

    const user = await userRepository.findById(refreshToken.userId);
    baseLogger.info(`${JSON.stringify(user)}`)
    if (!user) {
      return null;
    }

    await authRepository.revokeRefreshTokenById(refreshToken.id, now);

    const userRoles = await userRoleRepository.findByUserId(user.id);
    const roles = userRoles.map((ur) => ur.role.name as UserRoleType);

    const tokenPair = await jwtService.generateTokenPair({
      userId: refreshToken.userId,
      sessionId: refreshToken.sessionId,
      status: user.status,
      roles: roles,
    });

    baseLogger.info(`Generated new token pair for user ${user.id} 
      with session ${refreshToken.sessionId} during refresh token flow.${tokenPair} `);


    await this.createRefreshToken(
      tokenPair.refreshToken,
      user.id,
      tokenPair.sessionId,
      metadata,
    );

    return tokenPair;
  }

  async me(userId: string): Promise<AuthMeResponseDto | null> {
    const cacheKey = redisKey.auth.me(userId);
    const cached = await redisService.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached) as AuthMeResponseDto;
      } catch {
        // Ignore malformed cache and rebuild from the database.
      }
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return null;
    }

    const response = authResponse.toResponse({
      type: "me",
      user,
    });

    await redisService.set(cacheKey, JSON.stringify(response), {
      EX: 30,
    });

    return response;
  }

  async logout(accessToken: string, payload: LogoutDto): Promise<void> {
    await redisService.set(redisKey.auth.accessTokenBlacklist(accessToken), "1", {
      EX: 15 * 60,
    });

    const hashedToken = hasherToken(payload.refreshToken);
    const refreshToken =
      await authRepository.findRefreshTokenByToken(hashedToken);
    if (refreshToken) {
      await authRepository.revokeRefreshTokenById(refreshToken.id, new Date());
    }
  }

  private async createRefreshToken(
    refreshToken: string,
    userId: string,
    sessionId: string,
    metadata: SessionMetadata,
  ) {
    const createdRefreshToken = await authRepository.createRefreshToken({
      userId: userId,
      token: hasherToken(refreshToken),
      sessionId: sessionId,
      expireAt: new Date(
        Date.now() + ms(configService.REFRESH_TOKEN_EXPIRES_IN as StringValue),
      ),
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    });

    return createdRefreshToken;
  }
}

export const authService = new AuthService();
