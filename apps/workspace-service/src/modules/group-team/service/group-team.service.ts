import type { Position } from 'apps/workspace-service/generated/prisma';

export const GROUP_TEAM_SERVICE = Symbol('GROUP_TEAM_SERVICE');

export type CreateGroupTeamPayload = { name: string; createdById: string };
export type AddTeamMemberPayload = {
  teamPublicId: string;
  userId: string;
  position?: Position;
  requestedById: string;
};

export interface GroupTeamService {
  create(payload: CreateGroupTeamPayload): Promise<any>;
  addMember(payload: AddTeamMemberPayload): Promise<any>;
  resolveGroupForPost(groupPublicId: string, userId: string): Promise<any>;
}
