import { PrismaService } from '@api/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  authSessionUserSelect,
  type AuthRepository,
  type AuthSessionUser,
  type CreateAuthUserPayload,
  type CreateRefreshTokenPayload,
  type RefreshTokenRecord,
  refreshTokenSelect,
} from '../auth.repository';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(payload: CreateAuthUserPayload): Promise<AuthSessionUser> {
    return this.prisma.user.create({
      data: {
        email: payload.email.trim(),
        username: payload.username.trim(),
        password: payload.password,
        avatar: 'https://threads.file.huydarealest.com/thread-store/medias/fall_back/fall_back.jpg',
      },
      select: authSessionUserSelect,
    });
  }

  async findUserByLogin(login: string): Promise<AuthSessionUser | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
      select: authSessionUserSelect,
    });
  }

  async createRefreshToken(payload: CreateRefreshTokenPayload): Promise<void> {
    await this.prisma.refreshToken.create({
      data: payload,
    });
  }

  async findRefreshTokenByToken(token: string): Promise<RefreshTokenRecord | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      select: refreshTokenSelect,
    });
  }

  async revokeRefreshTokenById(id: number, revokedAt: Date): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt },
    });
  }

  async findUserByEmail(email: string): Promise<AuthSessionUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: authSessionUserSelect,
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  async updateVerifiedEmail(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { verifiedAt: new Date() },
    });
  }
}
