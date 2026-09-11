import type { Prisma, Skill } from 'apps/workspace-service/generated/prisma';

export const SKILL_REPOSITORY = Symbol('SKILL_REPOSITORY');

export interface SkillRepository {
  findIds(
    ids: number[],
    tx?: Prisma.TransactionClient,
  ): Promise<Array<{ id: number }>>;
  findAll(tx?: Prisma.TransactionClient): Promise<Skill[]>;
}
