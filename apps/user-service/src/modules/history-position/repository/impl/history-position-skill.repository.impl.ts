import { PrismaService } from '@user-service/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { Prisma } from 'apps/user-service/generated/prisma';
import type { HistoryPositionSkillRepository } from '../history-position-skill.repository';

@Injectable()
export class HistoryPositionSkillRepositoryImpl
  implements HistoryPositionSkillRepository
{
  constructor(private readonly prisma: PrismaService) {}

  createMany(
    historyPositionId: number,
    skillIds: number[],
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).historyPositionSkill.createMany({
      data: skillIds.map((skillId) => ({ historyPositionId, skillId })),
    });
  }

  findManyByHistoryPosition(
    historyPositionId: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).historyPositionSkill.findMany({
      where: { historyPositionId, historyPosition: { userId } },
      include: { skill: true },
      orderBy: { skill: { name: 'asc' } },
    });
  }
}
