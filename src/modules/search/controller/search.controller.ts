import { Message } from '@/common/decorators/message.decorator';
import { Pagination } from '@/common/decorators/pagination.decorator';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { Body, Controller, Get, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { buildPagination } from '@/shared/pagination/cursor-pagination';
import { SearchPostsQueryDto, SearchTopicQueryDto, SearchUsernameQueryDto } from '../dto/search.dto';
import { SearchService } from '../service/search.service';
import { UserService } from '@/modules/user/service/user.service';

@ApiTags('Search')
@ApiBearerAuth('bearer')
@UseGuards(AccessTokenGuard)
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly userService: UserService,
  ) {}

  @Get('posts')
  @Pagination()
  @Message('Posts retrieved successfully')
  @ApiOperation({ summary: 'Search visible posts by content' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully' })
  async searchPost(@Query() query: SearchPostsQueryDto, @Req() request: Request) {
    const { currentAfter, currentLimit } = buildPagination(query);
    const { rows, pagination } = await this.searchService.searchPost({
      q: query.q,
      after: currentAfter ?? undefined,
      take: currentLimit,
      serpType: query.serp_type,
      userId: request.user?.sub,
    });
    return { data: rows, pagination };
  }

  @Get('username')
  @Message('Usernames retrieved successfully')
  @ApiOperation({ summary: 'Search usernames' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usernames retrieved successfully' })
  async searchUsername(@Query() query: SearchUsernameQueryDto) {
    if (query.q.length === 1) {
      return this.userService.searchUsernameOneQuery({ query: query.q });
    }
    return this.userService.searchUsername({ query: query.q });
  }

  @Get('topic')
  @Message('Topics retrieved successfully')
  @ApiOperation({ summary: 'Search topics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Topics retrieved successfully' })
  searchTopic(@Query() query: SearchTopicQueryDto) {
    return this.searchService.searchTopic({ q: query.q });
  }
}
