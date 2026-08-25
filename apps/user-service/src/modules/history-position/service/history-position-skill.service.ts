import type { Prisma } from '../../../../generated/prisma';
import type { HistoryPositionSkillWithSkill } from '../repository/history-position-skill.repository';

export const HISTORY_POSITION_SKILL_SERVICE = Symbol(
  'HISTORY_POSITION_SKILL_SERVICE',
);

export interface HistoryPositionSkillService {
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
