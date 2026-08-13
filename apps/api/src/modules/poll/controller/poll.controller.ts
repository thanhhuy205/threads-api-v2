import { AUTH_MESSAGE } from "@/constants/message";
import { Message } from '@/common/decorators/message.decorator';
import { UnauthorizedException } from '@/errors/error';
import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HttpRequest as Request } from '@/common/types/http.type';
import { CreateVoteDto, VoteParamsDto } from '../dto/request';
import { VoteService } from '../service/vote.service';

@ApiTags('Poll')
@ApiBearerAuth('bearer')
@Controller('polls')
export class PollController {
  constructor(private readonly voteService: VoteService) {}

  @Post(':pollId/vote')
  @HttpCode(HttpStatus.OK)
  @Message('Vote created successfully')
  @ApiOperation({ summary: 'Vote for a poll option' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vote created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Vote is being processed' })
  async createVote(
    @Param() params: VoteParamsDto,
    @Body() payload: CreateVoteDto,
    @Req() request: Request,
  ) {
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }

    return this.voteService.createVote({
      pollId: params.pollId,
      pollOptionId: payload.pollOptionId,
      userId,
    });
  }
}
