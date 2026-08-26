import { PrismaService } from '@user-service/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Position, type Prisma } from 'apps/user-service/generated/prisma';
import type { UserTeamRepository } from '../user-team.repository';

export type CreateUserTeamPayload = {
  userId: string;
  teamId: number;
  position?: Position;
};

const userTeamSelect = {
  id: true,
  userId: true,
  teamId: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UserTeamRepositoryImpl implements UserTeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateUserTeamPayload, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).userTeam.create({
      data: {
        ...payload,
        position: payload.position ?? Position.OTHER,
      },
      select: userTeamSelect,
    });
  }

  findByUserAndTeam(
    userId: string,
    teamId: number,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).userTeam.findUnique({
      where: {
        userId_teamId: { userId, teamId },
      },
      select: userTeamSelect,
    });
  }
}
