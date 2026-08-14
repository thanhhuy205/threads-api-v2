import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

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
export class GroupTeamRepository {
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
