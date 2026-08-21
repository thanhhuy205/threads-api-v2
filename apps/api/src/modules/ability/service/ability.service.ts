import type { PermissionCode } from '@/common/constants/permission.constant';
import type { PermissionScope } from '@prisma/client';

export const ABILITY_SERVICE = Symbol('ABILITY_SERVICE');

export type AppAbility = {
  can(action: PermissionCode, subject: 'all'): boolean;
};

export interface AbilityService {
  createForUser(userId: string, scope?: PermissionScope): Promise<AppAbility>;
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
