import type { Position, Prisma } from 'apps/workspace-service/generated/prisma';

export const USER_TEAM_SERVICE = Symbol('USER_TEAM_SERVICE');

export type AddUserToTeamPayload = {
  userId: string;
  teamId: number;
  position?: Position;
};

export interface UserTeamService {
  addUser(payload: AddUserToTeamPayload, tx?: Prisma.TransactionClient): Promise<any>;
  isMember(userId: string, teamId: number, tx?: Prisma.TransactionClient): Promise<boolean>;
}
