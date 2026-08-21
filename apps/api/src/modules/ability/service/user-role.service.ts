import type { UserRole } from '@prisma/client';
import type { UserRoleWithRole } from '../repository/user-role.repository';

export const USER_ROLE_SERVICE = Symbol('USER_ROLE_SERVICE');

export interface UserRoleService {
  getUserRoles(userId: string): Promise<UserRoleWithRole[]>;
  assignRoleToUser(userId: string, roleId: string): Promise<UserRole>;
  findByUserId(userId: string): Promise<UserRoleWithRole[]>;
}
