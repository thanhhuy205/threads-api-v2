import type { LoginDto } from "@/modules/auth/dto/request/login.request.dto";
import { authResponse, type AuthSessionResponseDto } from "@/modules/auth/dto/response/auth.response";
import type { SessionMetadata } from "@/modules/auth/interfaces/session-metadata";
import { comparePassword } from "@/modules/auth/util/hasher-password";
import { hasherToken } from "@/modules/auth/util/hasher-token";
import { JwtService } from "@/modules/jwt/service/jwt.service";
import { UserRoleType } from "@prisma/client";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from "ms";
import { PrismaService } from '@/shared/database/prisma.service';
import { AdminAuthRepository } from "./admin-auth.repository";

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminAuthRepository: AdminAuthRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    payload: LoginDto,
    metadata: SessionMetadata,
  ): Promise<AuthSessionResponseDto | null> {
    const user = await this.adminAuthRepository.findUserByLogin(payload.login);

    const isPasswordValid =
      user && user.password
        ? comparePassword(payload.password, user.password)
        : false;
    if (!user || !isPasswordValid) {
      return null;
    }

    const roles = user.userRoles.map((ur) => ur.role.name as UserRoleType);
    const hasAdminScopeRole = roles.some((role) => role !== UserRoleType.USER);

    if (!hasAdminScopeRole) {
      return null;
    }

    const tokenPair = await this.jwtService.generateTokenPair({
      userId: user.id,
      status: user.status,
      roles,
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hasherToken(tokenPair.refreshToken),
        sessionId: tokenPair.sessionId,
        expireAt: new Date(
          Date.now() + ms(this.configService.getOrThrow<string>('JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN') as StringValue),
        ),
        ip: metadata.ip,
        userAgent: metadata.userAgent,
      },
    });

    return authResponse.toResponse({
      type: "auth",
      user,
      ...tokenPair,
    });
  }
}
