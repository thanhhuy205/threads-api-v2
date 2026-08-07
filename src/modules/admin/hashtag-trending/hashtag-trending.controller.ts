import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';
import { Pagination } from '@/common/decorators/pagination.decorator';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { buildPagination } from '@/shared/pagination/pagination';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { TrendingHashtagQueryDto } from "./dto/request/trending-hashtag.query.dto";
import { HashtagTrendingService } from "./hashtag-trending.service";

@ApiTags('Admin')
@ApiBearerAuth('bearer')
@UseGuards(AccessTokenGuard, AdminRoleGuard)
@Controller('admin/hashtags')
export class HashtagTrendingController {
  constructor(private readonly hashtagTrendingService: HashtagTrendingService) {}

  @Get('trending')
  @Pagination()
  @Message('Trending hashtags retrieved successfully')
  @ApiOperation({ summary: 'List trending hashtags' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Trending hashtags retrieved successfully' })
  async listTrendingHashtags(@Query() query: TrendingHashtagQueryDto) {
    const { currentPage, currentLimit } = buildPagination(query);
    const result = await this.hashtagTrendingService.listTrendingHashtags({
      page: currentPage,
      limit: currentLimit,
    });
    return { data: result.rows, pagination: result.pagination };
  }
}
