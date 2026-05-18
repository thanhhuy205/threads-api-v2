import configService from "@/config/config";
import { UserRoleType } from "@prisma/client";
import ms, { StringValue } from "ms";
import { authResponse, type AuthSessionResponseDto } from "@/modules/auth/dto/response/auth.response";
import { authRepository } from "@/modules/auth/repository/auth.repository";
import type { SessionMetadata } from "@/modules/auth/interfaces/session-metadata";
import { comparePassword } from "@/modules/auth/util/hasher-password";
import { hasherToken } from "@/modules/auth/util/hasher-token";
import { jwtService } from "@/modules/jwt/service/jwt.service";
import type { LoginDto } from "@/modules/auth/dto/request/login.request.dto";
import { adminAuthRepository } from "./admin-auth.repository";

class AdminAuthService {
  async login(
    payload: LoginDto,
    metadata: SessionMetadata,
  ): Promise<AuthSessionResponseDto | null> {
    const user = await adminAuthRepository.findUserByLogin(payload.login);

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

    const tokenPair = await jwtService.generateTokenPair({
      userId: user.id,
      status: user.status,
      roles,
    });

    await authRepository.createRefreshToken({
      userId: user.id,
      token: hasherToken(tokenPair.refreshToken),
      sessionId: tokenPair.sessionId,
      expireAt: new Date(
        Date.now() + ms(configService.REFRESH_TOKEN_EXPIRES_IN as StringValue),
      ),
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    });

    return authResponse.toResponse({
      type: "auth",
      user,
      ...tokenPair,
    });
  }
}

export const adminAuthService = new AdminAuthService();
