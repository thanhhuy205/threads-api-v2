import { Message } from '@/common/decorators/message.decorator';
import { IsPublic } from '@/common/decorators/is-public.decorator';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTopicDto, SearchTopicQueryDto } from '../dto/request';
import { TopicService } from '../service/topic.service';

@ApiTags('Topic')
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  @IsPublic()
  @Message('Topics retrieved successfully')
  @ApiOperation({ summary: 'Search topics by query' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Topics retrieved successfully' })
  getByName(@Query() query: SearchTopicQueryDto) {
    return this.topicService.searchByName(query.q);
  }

  @Post()
  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @Message('Topic upserted')
  @ApiOperation({ summary: 'Create a topic or increment its count' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Topic upserted' })
  create(@Body() payload: CreateTopicDto) {
    return this.topicService.createOrIncrement(payload.name);
  }
}
