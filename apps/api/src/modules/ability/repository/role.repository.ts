import type { Role } from '@prisma/client';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface RoleRepository {
  findAll(): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
}
