import { PrismaService } from '../../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  type CreateRefreshTokenPayload,
  type RefreshTokenRecord,
  type RefreshTokenRepository,
  refreshTokenSelect,
} from '../refresh-token.repository';

@Injectable()
export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateRefreshTokenPayload): Promise<void> {
    await this.prisma.refreshToken.create({
      data: payload,
    });
  }

  async findByToken(token: string): Promise<RefreshTokenRecord | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      select: refreshTokenSelect,
    });
  }

  async revokeById(id: number, revokedAt: Date): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt },
    });
  }
}
