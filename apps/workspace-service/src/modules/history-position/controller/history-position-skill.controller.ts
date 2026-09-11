import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { Message } from '@/common/decorators/message.decorator';
import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HISTORY_POSITION_SKILL_SERVICE,
  type HistoryPositionSkillService,
} from '../service/history-position-skill.service';

@ApiTags('History Position Skill')
@ApiBearerAuth('bearer')
@Controller('history-position-skills')
export class HistoryPositionSkillController {
  constructor(
    @Inject(HISTORY_POSITION_SKILL_SERVICE)
    private readonly historyPositionSkillService: HistoryPositionSkillService,
  ) {}

  @Get(':historyPositionId')
  @Message('History position skills retrieved successfully')
  @ApiOperation({ summary: 'Get skills linked to a history position' })
  findAll(
    @Param('historyPositionId', ParseIntPipe) historyPositionId: number,
    @GetUserId() userId: string,
  ) {
    return this.historyPositionSkillService.findManyByHistoryPosition(
      historyPositionId,
      userId,
    );
  }
}
