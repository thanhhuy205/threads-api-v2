import type { Role } from '../../../../generated/prisma';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface RoleRepository {
  findAll(): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
}
