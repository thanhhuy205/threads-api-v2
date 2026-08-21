import type { Role } from '@prisma/client';

export const ROLE_SERVICE = Symbol('ROLE_SERVICE');

export interface RoleService {
  getRoles(): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
}
