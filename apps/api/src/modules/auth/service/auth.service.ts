import configService from "@/config/config";
import { redisKey } from "@/constants/resolve-key/redis-key";
import { NotFoundException } from "@/errors/error";
import { RoleService } from "@/modules/access-control/role/service/role.service";
import { UserRoleService } from "@/modules/access-control/role/service/user-role.service";
import type { SessionMetadata } from "@/modules/auth/interfaces/session-metadata";
import { VerificationRepository } from "@/modules/auth/repository/verification.repository";
import {
  comparePassword,
  hashPassword,
} from "@/modules/auth/util/hasher-password";
import { hasherToken } from "@/modules/auth/util/hasher-token";
import { BloomProducer } from "@/modules/job/bloom/producer/bloom.producer";
import { EmailProducer } from "@/modules/job/email/producer/email.producer";
import { TokenPairResponse } from "@/modules/jwt/dto/response/token-pair.response";
import { JwtService } from "@/modules/jwt/service/jwt.service";
import { UserService } from "@/modules/user/service/user.service";
import { RedisService } from "@libs/cache/redis.service";
import { Injectable, Logger } from '@nestjs/common';
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
import { AuthRepository } from "../repository/auth.repository";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, { timestamp: true });

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly verificationRepository: VerificationRepository,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly userService: UserService,
    private readonly bloomProducer: BloomProducer,
    private readonly emailProducer: EmailProducer,
    private readonly redisService: RedisService,
  ) { }

  async register(
    payload: RegisterDto,
    metadata: SessionMetadata,
  ): Promise<AuthSessionResponseDto> {
    const password = hashPassword(payload.password);
    const user = await this.authRepository.createUser({ ...payload, password });

    const role = await this.roleService.findByName(UserRoleType.USER);
    if (role) {
      await this.userRoleService.assignRoleToUser(user.id, role.id);
    }

    const tokenPair = await this.jwtService.generateTokenPair({
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
      this.bloomProducer.addUserNameAndEmailToBloom({
        email: user.email,
        userName: user.username,
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
    const user = await this.authRepository.findUserByEmail(payload.email);
    if (!user) {
      throw new NotFoundException("Email or username not found");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = hasherToken(token);

    await Promise.all([
      this.emailProducer.sendForgotPasswordEmail({
        userId: user.id,
        email: user.email,
        token,
      }),

      this.verificationRepository.create({
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
    const user = await this.authRepository.findUserByLogin(payload.login);

    const isPasswordValid =
      user && user.password
        ? comparePassword(payload.password, user.password)
        : false;
    if (!user || !isPasswordValid) {
      return null;
    }

    const userRoles = await this.userRoleService.findByUserId(user.id);
    const roles = userRoles.map((ur) => ur.role.name as UserRoleType);

    const tokenPair = await this.jwtService.generateTokenPair({
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
    const permission = await this.userService.getPermissionPositionByUserId(user.id);
    const positionPermission = permission?.userPositions.map((pos) => pos.positionPermission.permission.code) || [];

    return authResponse.toResponse({
      type: "auth",
      user,
      ...tokenPair,
    }, positionPermission);
  }

  async resendVerifyEmail(originUrl: string, userId?: string): Promise<void> {
    const user = await this.userService.findByUserId(userId ?? "");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const verificationRecord = await this.verificationRepository.findLatestByUserIdAndType(
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
      this.emailProducer.sendVerifyEmail({
        userName: user.username,
        email: user.email,
        token,
        originUrl
      }),
      this.verificationRepository.create({
        userId: user.id,
        tokenHash: hashedToken,
        type: VerificationCodeType.VERIFY_ACCOUNT,
      }),
    ]);
  }

  async verifyEmail(payload: ValidateTokenDto): Promise<void> {
    const hashedToken = hasherToken(payload.token);
    const verificationRecord =
      await this.verificationRepository.findByTokenHashAndType(
        hashedToken,
        VerificationCodeType.VERIFY_ACCOUNT,
      );
    if (!verificationRecord) {
      throw new NotFoundException("Invalid token");
    }

    if (verificationRecord.expiresAt < new Date()) {
      throw new NotFoundException("Mã xac thực đã hết hạn");
    }

    await this.authRepository.updateVerifiedEmail(verificationRecord.userId);
    await this.redisService.redis.del(redisKey.auth.me(verificationRecord.userId));
  }

  async validateEmail(
    payload: ValidateEmailDto,
  ): Promise<ValidateUserResponseDto> {
    const isExistingEmail = await this.redisService.redis.bf.exists(
      redisKey.bloom.emails(),
      payload.email,
    );
    this.logger.log(
      `Checked email: ${payload.email} in Bloom filter, exists: ${isExistingEmail}`,
    );
    return {
      available: !Boolean(isExistingEmail),
    };
  }

  async validateUsername(
    payload: ValidateUsernameDto,
  ): Promise<ValidateUserResponseDto> {
    const isExistingUsername = await this.redisService.redis.bf.exists(
      redisKey.bloom.usernames(),
      payload.username,
    );
    this.logger.log(
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
      await this.verificationRepository.findByTokenHashAndType(
        hashedToken,
        VerificationCodeType.FORGOT_PASSWORD,
      );
    if (!verificationRecord) {
      throw new NotFoundException("Invalid token");
    }

    if (verificationRecord.expiresAt < new Date()) {
      throw new NotFoundException("Token expired");
    }

    const user = await this.authRepository.findUserByEmail(payload.email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (payload.password !== payload.confirmPassword) {
      throw new NotFoundException("Password and confirm password do not match");
    }

    const newPassword = hashPassword(payload.password);
    await this.authRepository.updatePassword(user.id, newPassword);
  }

  async refreshToken(
    payload: RefreshTokenDto,
    metadata: SessionMetadata,
  ): Promise<TokenPairResponse | null> {
    const hashedToken = hasherToken(payload.refreshToken);
    const refreshToken =
      await this.authRepository.findRefreshTokenByToken(hashedToken);

    this.logger.log(`Attempting to refresh token with provided refresh token. Found refresh token record: ${JSON.stringify(refreshToken)}`);
    if (!refreshToken || refreshToken.revokedAt) {
      return null;
    }

    const now = new Date();
    if (refreshToken.expireAt < now) {
      await this.authRepository.revokeRefreshTokenById(refreshToken.id, now);
      this.logger.log(`Refresh token with id ${refreshToken.id} has expired and been revoked.`);
      return null;
    }

    const user = await this.userService.findByUserId(refreshToken.userId);
    this.logger.log(`Found user ${user?.id} for refresh token with id ${refreshToken.id} user = ${JSON.stringify(user)}.`);
    if (!user) {
      return null;
    }

    await this.authRepository.revokeRefreshTokenById(refreshToken.id, now);

    const userRoles = await this.userRoleService.findByUserId(user.id);
    const roles = userRoles.map((ur) => ur.role.name as UserRoleType);

    const tokenPair = await this.jwtService.generateTokenPair({
      userId: refreshToken.userId,
      sessionId: refreshToken.sessionId,
      status: user.status,
      roles: roles,
    });

    this.logger.log(`Generated new token pair for user ${user.id}
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
    const cached = await this.redisService.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached) as AuthMeResponseDto;
      } catch {
        // Ignore malformed cache and rebuild from the database.
      }
    }

    const user = await this.userService.findByUserId(userId);
    if (!user) {
      return null;
    }

    const permission = await this.userService.getPermissionPositionByUserId(userId);
    const positionPermission = permission?.userPositions.map((pos) => pos.positionPermission.permission.code) || [];
    console.log(positionPermission);
    const response = authResponse.toResponse({
      type: "me",
      user,
    }, positionPermission);
    console.log(response);
    await this.redisService.redis.set(cacheKey, JSON.stringify(response), {
      EX: 30,
    });

    return response;
  }

  async logout(accessToken: string, payload: LogoutDto): Promise<void> {
    await this.redisService.redis.set(redisKey.auth.accessTokenBlacklist(accessToken), "1", {
      EX: 15 * 60,
    });

    const hashedToken = hasherToken(payload.refreshToken);
    const refreshToken =
      await this.authRepository.findRefreshTokenByToken(hashedToken);
    if (refreshToken) {
      await this.authRepository.revokeRefreshTokenById(refreshToken.id, new Date());
    }
  }

  private async createRefreshToken(
    refreshToken: string,
    userId: string,
    sessionId: string,
    metadata: SessionMetadata,
  ) {
    const createdRefreshToken = await this.authRepository.createRefreshToken({
      userId: userId,
      token: hasherToken(refreshToken),
      sessionId: sessionId,
      expireAt: new Date(
        Date.now() + ms(configService.JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN as StringValue),
      ),
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    });

    return createdRefreshToken;
  }
}
