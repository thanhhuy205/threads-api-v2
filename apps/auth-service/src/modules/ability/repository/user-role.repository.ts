import type { Prisma, UserRole } from "apps/auth-service/generated/prisma";

export const USER_ROLE_REPOSITORY = Symbol('USER_ROLE_REPOSITORY');

export type UserRoleWithRole = Prisma.UserRoleGetPayload<{
  include: { role: true };
}>;

export interface UserRoleRepository {
  findByUserId(userId: string): Promise<UserRoleWithRole[]>;
  assignRole(userId: string, roleId: string): Promise<UserRole>;
  removeRole(userId: string, roleId: string): Promise<{ count: number }>;
}
