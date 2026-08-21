import { PermissionScope } from "@prisma/client";

export interface PostCreationContext {
    scope: PermissionScope;
    groupTeamId?: number;
}
