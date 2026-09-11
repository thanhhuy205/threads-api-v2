import type { PermissionCode } from '@libs/common/src/constants/permission.constant';
import type { PermissionScope } from 'apps/workspace-service/generated/prisma';

export const ABILITY_SERVICE = Symbol('ABILITY_SERVICE');

export interface AppAbility {
  can(action: PermissionCode): boolean;
}

export interface AbilityService {
  createForUser(
    userId: string,
    scope?: PermissionScope,
  ): Promise<AppAbility>;
  can(
    userId: string,
    permission: PermissionCode,
    scope?: PermissionScope,
  ): Promise<boolean>;
  assertCan(
    userId: string,
    permission: PermissionCode,
    scope?: PermissionScope,
  ): Promise<void>;
}
