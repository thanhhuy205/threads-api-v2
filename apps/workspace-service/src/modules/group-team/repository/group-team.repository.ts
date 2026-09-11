import type { Prisma } from 'apps/workspace-service/generated/prisma';

export const GROUP_TEAM_REPOSITORY = Symbol('GROUP_TEAM_REPOSITORY');
export type CreateGroupTeamPayload = { name: string; createdById: string };

export interface GroupTeamRepository {
  create(payload: CreateGroupTeamPayload, tx?: Prisma.TransactionClient): Promise<any>;
  findByPublicId(publicId: string, tx?: Prisma.TransactionClient): Promise<any>;
  findByName(name: string, tx?: Prisma.TransactionClient): Promise<any>;
}
