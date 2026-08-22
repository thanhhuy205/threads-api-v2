import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { Message } from '@/common/decorators/message.decorator';
import { Body, Controller, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVoteDto, VoteParamsDto } from '../dto/request';
import { VOTE_SERVICE, type VoteService } from '../service/vote.service';

@ApiTags('Poll')
@ApiBearerAuth('bearer')
@Controller('polls')
export class PollController {
  constructor(@Inject(VOTE_SERVICE) private readonly voteService: VoteService) {}

  @Post(':pollId/vote')
  @HttpCode(HttpStatus.OK)
  @Message('Vote created successfully')
  @ApiOperation({ summary: 'Vote for a poll option' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vote created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Vote is being processed' })
  async createVote(
    @Param() params: VoteParamsDto,
    @Body() payload: CreateVoteDto,
    @GetUserId() userId: string,
  ) {
    return this.voteService.createVote({
      pollId: params.pollId,
      pollOptionId: payload.pollOptionId,
      userId,
    });
  }
}
