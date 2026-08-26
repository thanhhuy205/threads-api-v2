import { TransactionModule } from '@user-service/transaction/transaction.module';
import { Module } from '@nestjs/common';
import { HistoryPositionSkillController } from './controller/history-position-skill.controller';
import { HistoryPositionController } from './controller/history-position.controller';
import { SkillController } from './controller/skill.controller';
import { HISTORY_POSITION_REPOSITORY } from './repository/history-position.repository';
import { HISTORY_POSITION_SKILL_REPOSITORY } from './repository/history-position-skill.repository';
import { HistoryPositionRepositoryImpl } from './repository/impl/history-position.repository.impl';
import { HistoryPositionSkillRepositoryImpl } from './repository/impl/history-position-skill.repository.impl';
import { SkillRepositoryImpl } from './repository/impl/skill.repository.impl';
import { SKILL_REPOSITORY } from './repository/skill.repository';
import { HISTORY_POSITION_SERVICE } from './service/history-position.service';
import { HISTORY_POSITION_SKILL_SERVICE } from './service/history-position-skill.service';
import { HistoryPositionServiceImpl } from './service/impl/history-position.service.impl';
import { HistoryPositionSkillServiceImpl } from './service/impl/history-position-skill.service.impl';
import { SkillServiceImpl } from './service/impl/skill.service.impl';
import { SKILL_SERVICE } from './service/skill.service';

@Module({
  imports: [TransactionModule],
  controllers: [
    HistoryPositionController,
    HistoryPositionSkillController,
    SkillController,
  ],
  providers: [
    {
      provide: HISTORY_POSITION_REPOSITORY,
      useClass: HistoryPositionRepositoryImpl,
    },
    {
      provide: HISTORY_POSITION_SKILL_REPOSITORY,
      useClass: HistoryPositionSkillRepositoryImpl,
    },
    { provide: SKILL_REPOSITORY, useClass: SkillRepositoryImpl },
    {
      provide: HISTORY_POSITION_SERVICE,
      useClass: HistoryPositionServiceImpl,
    },
    {
      provide: HISTORY_POSITION_SKILL_SERVICE,
      useClass: HistoryPositionSkillServiceImpl,
    },
    { provide: SKILL_SERVICE, useClass: SkillServiceImpl },
  ],
  exports: [
    HISTORY_POSITION_SERVICE,
    HISTORY_POSITION_SKILL_SERVICE,
    SKILL_SERVICE,
  ],
})
export class HistoryPositionModule {}
