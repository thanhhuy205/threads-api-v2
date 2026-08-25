import { PermissionScope } from "../../../../generated/prisma";

export interface PostCreationContext {
    scope: PermissionScope;
    groupTeamId?: number;
}
