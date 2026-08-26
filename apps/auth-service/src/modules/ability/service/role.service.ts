import type { Role } from "apps/auth-service/generated/prisma";

export const ROLE_SERVICE = Symbol('ROLE_SERVICE');

export interface RoleService {
  getRoles(): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
}
