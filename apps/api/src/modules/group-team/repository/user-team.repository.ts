import type { Position, Prisma } from '@prisma/client';

export const USER_TEAM_REPOSITORY = Symbol('USER_TEAM_REPOSITORY');
export type CreateUserTeamPayload = { userId: string; teamId: number; position?: Position };

export interface UserTeamRepository {
  create(payload: CreateUserTeamPayload, tx?: Prisma.TransactionClient): Promise<any>;
  findByUserAndTeam(
    userId: string,
    teamId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<any>;
}
