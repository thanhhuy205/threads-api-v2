import { PrismaService } from '@workspace-service/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { Prisma } from 'apps/workspace-service/generated/prisma';
import type { GroupTeamRepository } from '../group-team.repository';

export type CreateGroupTeamPayload = {
  name: string;
  createdById: string;
};

const groupTeamSelect = {
  id: true,
  publicId: true,
  name: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class GroupTeamRepositoryImpl implements GroupTeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateGroupTeamPayload, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).groupTeam.create({
      data: payload,
      select: groupTeamSelect,
    });
  }

  findByPublicId(publicId: string, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).groupTeam.findUnique({
      where: { publicId },
      select: groupTeamSelect,
    });
  }

  findByName(name: string, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).groupTeam.findUnique({
      where: { name },
      select: groupTeamSelect,
    });
  }
}
