import { PrismaService } from '@workspace-service/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { Prisma } from 'apps/workspace-service/generated/prisma';
import {
  type CreateHistoryPositionPayload,
  type HistoryPositionRepository,
} from '../history-position.repository';

const historyPositionInclude = {
  historyPositionSkills: {
    include: {
      skill: true,
    },
  },
} satisfies Prisma.HistoryPositionInclude;

@Injectable()
export class HistoryPositionRepositoryImpl
  implements HistoryPositionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  create(
    payload: CreateHistoryPositionPayload,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).historyPosition.create({
      data: payload,
      select: { id: true },
    });
  }

  findByIdAndUserId(
    id: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).historyPosition.findFirst({
      where: { id, userId },
      include: historyPositionInclude,
    });
  }

  findManyByUserId(userId: string, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).historyPosition.findMany({
      where: { userId },
      include: historyPositionInclude,
      orderBy: { createdAt: 'desc' },
    });
  }
}
