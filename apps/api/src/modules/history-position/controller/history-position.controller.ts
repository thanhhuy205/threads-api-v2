import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { Message } from '@/common/decorators/message.decorator';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateHistoryPositionDto } from '../dto/request';
import {
  HISTORY_POSITION_SERVICE,
  type HistoryPositionService,
} from '../service/history-position.service';

@ApiTags('History Position')
@ApiBearerAuth('bearer')
@Controller('history-position')
export class HistoryPositionController {
  constructor(
    @Inject(HISTORY_POSITION_SERVICE)
    private readonly historyPositionService: HistoryPositionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Message('History position created successfully')
  @ApiOperation({ summary: 'Create a history position' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'History position created' })
  create(
    @Body() payload: CreateHistoryPositionDto,
    @GetUserId() userId: string,
  ) {
    return this.historyPositionService.create({
      userId,
      title: payload.title,
      detail: payload.detail,
      skillIds: payload.skills,
    });
  }

  @Get()
  @Message('History positions retrieved successfully')
  @ApiOperation({ summary: 'Get full history positions for the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'History positions retrieved' })
  findAll(@GetUserId() userId: string) {
    return this.historyPositionService.findManyByUserId(userId);
  }
}
