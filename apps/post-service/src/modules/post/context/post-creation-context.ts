import { PermissionScope } from '../../../generated/prisma/client';

export interface PostCreationContext {
  scope: PermissionScope;
  groupTeamId?: number;
}
