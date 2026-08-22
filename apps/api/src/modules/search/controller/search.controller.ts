import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { Message } from '@/common/decorators/message.decorator';
import { CursorPagination } from '@/common/decorators/cursor-pagination.decorator';
import { ApiCursorPaginatedResponse } from '@/common/decorators/swagger-response.decorator';
import type { CursorPagination as CursorPaginationParams } from '@/common/helpers/cursor-pagination.helper';
import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchPostsQueryDto, SearchTopicQueryDto, SearchUsernameQueryDto } from '../dto/search.dto';
import { SEARCH_SERVICE, type SearchService } from '../service/search.service';
import { USER_SERVICE, type UserService } from '@/modules/user/service/user.service';

@ApiTags('Search')
@ApiBearerAuth('bearer')
@Controller('search')
export class SearchController {
  constructor(
    @Inject(SEARCH_SERVICE) private readonly searchService: SearchService,
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  @Get('posts')
  @Message('Posts retrieved successfully')
  @ApiOperation({ summary: 'Search visible posts by content' })
  @ApiCursorPaginatedResponse({ description: 'Posts retrieved successfully' })
  async searchPost(
    @Query() query: SearchPostsQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @GetUserId() userId: string,
  ) {
    const { rows, pagination } = await this.searchService.searchPost({
      q: query.q,
      after: cursor.after ?? undefined,
      take: cursor.take,
      serpType: query.serp_type,
      userId,
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
