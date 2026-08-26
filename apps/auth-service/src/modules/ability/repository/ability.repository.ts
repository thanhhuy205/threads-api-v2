import type { PermissionScope } from "apps/auth-service/generated/prisma";

export const ABILITY_REPOSITORY = Symbol('ABILITY_REPOSITORY');

export interface AbilityRepository {
  findPermissionCodes(
    userId: string,
    scopes: PermissionScope[],
  ): Promise<string[]>;
}
