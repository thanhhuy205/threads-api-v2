import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { SkillRepository } from '../skill.repository';

@Injectable()
export class SkillRepositoryImpl implements SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  findIds(ids: number[], tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).skill.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
  }

  findAll(tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).skill.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
