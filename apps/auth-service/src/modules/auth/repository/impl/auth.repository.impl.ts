import { Injectable } from '@nestjs/common';
import {
  authSessionUserSelect,
  type AuthRepository,
  type AuthSessionUser,
  type CreateAuthUserPayload,
} from '../auth.repository';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly prisma: PrismaService) { }

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
