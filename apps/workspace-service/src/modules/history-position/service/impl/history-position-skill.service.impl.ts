import { Inject, Injectable } from '@nestjs/common';
import type { Prisma } from 'apps/workspace-service/generated/prisma';
import {
  HISTORY_POSITION_SKILL_REPOSITORY,
  type HistoryPositionSkillRepository,
} from '../../repository/history-position-skill.repository';
import type { HistoryPositionSkillService } from '../history-position-skill.service';

@Injectable()
export class HistoryPositionSkillServiceImpl
  implements HistoryPositionSkillService
{
  constructor(
    @Inject(HISTORY_POSITION_SKILL_REPOSITORY)
    private readonly historyPositionSkillRepository: HistoryPositionSkillRepository,
  ) {}

  createMany(
    historyPositionId: number,
    skillIds: number[],
    tx?: Prisma.TransactionClient,
  ) {
    return this.historyPositionSkillRepository.createMany(
      historyPositionId,
      skillIds,
      tx,
    );
  }

  findManyByHistoryPosition(
    historyPositionId: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return this.historyPositionSkillRepository.findManyByHistoryPosition(
      historyPositionId,
      userId,
      tx,
    );
  }
}
