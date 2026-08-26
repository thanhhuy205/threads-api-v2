import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';
import { Pagination } from '@/common/decorators/pagination.decorator';
import { ApiOffsetPaginatedResponse } from '@/common/decorators/swagger-response.decorator';
import type { OffsetPagination } from '@/common/dto/pagination.dto';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { TrendingHashtagQueryDto } from "./dto/request/trending-hashtag.query.dto";
import { HashtagTrendingService } from "./hashtag-trending.service";

@ApiTags('Admin')
@ApiBearerAuth('bearer')
@UseGuards(AdminRoleGuard)
@Controller('admin/hashtags')
export class HashtagTrendingController {
  constructor(private readonly hashtagTrendingService: HashtagTrendingService) {}

  @Get('trending')
  @Message('Trending hashtags retrieved successfully')
  @ApiOperation({ summary: 'List trending hashtags' })
  @ApiOffsetPaginatedResponse({ description: 'Trending hashtags retrieved successfully' })
  async listTrendingHashtags(@Query() _query: TrendingHashtagQueryDto, @Pagination() pagination: OffsetPagination) {
    const result = await this.hashtagTrendingService.listTrendingHashtags({
      page: pagination.page,
      limit: pagination.limit,
    });
    return { data: result.rows, pagination: result.pagination };
  }
}
