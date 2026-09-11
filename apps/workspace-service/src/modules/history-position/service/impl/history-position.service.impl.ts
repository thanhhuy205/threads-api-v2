import { BadRequestException } from '@/errors/error';
import { TransactionService } from '@workspace-service/transaction/transaction.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  HISTORY_POSITION_REPOSITORY,
  type HistoryPositionRepository,
} from '../../repository/history-position.repository';
import {
  HISTORY_POSITION_SKILL_SERVICE,
  type HistoryPositionSkillService,
} from '../history-position-skill.service';
import {
  type CreateHistoryPositionInput,
  type HistoryPositionService,
} from '../history-position.service';
import { SKILL_SERVICE, type SkillService } from '../skill.service';

@Injectable()
export class HistoryPositionServiceImpl implements HistoryPositionService {
  constructor(
    @Inject(HISTORY_POSITION_REPOSITORY)
    private readonly historyPositionRepository: HistoryPositionRepository,
    @Inject(HISTORY_POSITION_SKILL_SERVICE)
    private readonly historyPositionSkillService: HistoryPositionSkillService,
    @Inject(SKILL_SERVICE)
    private readonly skillService: SkillService,
    private readonly transactionService: TransactionService,
  ) {}

  create(payload: CreateHistoryPositionInput) {
    const title = payload.title.trim();
    if (!title) {
      throw new BadRequestException('Title is required');
    }

    return this.transactionService.doInTransaction(async (tx) => {
      await this.skillService.assertAllExist(payload.skillIds, tx);

      const historyPosition = await this.historyPositionRepository.create(
        {
          userId: payload.userId,
          title,
          details: payload.detail?.trim() || undefined,
          timeStart: new Date(),
        },
        tx,
      );

      if (payload.skillIds.length) {
        await this.historyPositionSkillService.createMany(
          historyPosition.id,
          payload.skillIds,
          tx,
        );
      }

      return this.historyPositionRepository.findByIdAndUserId(
        historyPosition.id,
        payload.userId,
        tx,
      );
    });
  }

  findManyByUserId(userId: string) {
    return this.historyPositionRepository.findManyByUserId(userId);
  }
}
