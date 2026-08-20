import type { Prisma, Skill } from '@prisma/client';

export const SKILL_SERVICE = Symbol('SKILL_SERVICE');

export interface SkillService {
  assertAllExist(ids: number[], tx?: Prisma.TransactionClient): Promise<void>;
  findAll(tx?: Prisma.TransactionClient): Promise<Skill[]>;
}
