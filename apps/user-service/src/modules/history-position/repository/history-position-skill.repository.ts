import type { Prisma } from 'apps/user-service/generated/prisma';

export const HISTORY_POSITION_SKILL_REPOSITORY = Symbol(
  "HISTORY_POSITION_SKILL_REPOSITORY",
);

export type HistoryPositionSkillWithSkill =
  Prisma.HistoryPositionSkillGetPayload<{
    include: { skill: true };
  }>;

export interface HistoryPositionSkillRepository {
  createMany(
    historyPositionId: number,
    skillIds: number[],
    tx?: Prisma.TransactionClient,
  ): Promise<{ count: number }>;
  
  findManyByHistoryPosition(
    historyPositionId: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<HistoryPositionSkillWithSkill[]>;
}
