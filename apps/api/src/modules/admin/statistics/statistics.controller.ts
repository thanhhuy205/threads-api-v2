import { BadRequestException, Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { AdminStatsQueryDto } from "./dto/request/admin-stats.query.dto";
import { StatisticsService } from "./statistics.service";

@ApiTags('Admin')
@ApiBearerAuth('bearer')
@UseGuards(AdminRoleGuard)
@Controller('admin')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('stats')
  @Message('Admin statistics retrieved successfully')
  @ApiOperation({ summary: 'Get admin statistics overview' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Admin statistics retrieved successfully' })
  getOverview(@Query() query: AdminStatsQueryDto) {
    if (Boolean(query.startDate) !== Boolean(query.endDate)) {
      throw new BadRequestException('Start date and end date must be provided together');
    }
    if (query.startDate && query.endDate && query.startDate > query.endDate) {
      throw new BadRequestException('End date must be greater than or equal to start date');
    }
    if ((query.startDate && !this.isCalendarDate(query.startDate)) ||
      (query.endDate && !this.isCalendarDate(query.endDate))) {
      throw new BadRequestException('Invalid date');
    }
    return this.statisticsService.getOverview(query);
  }

  private isCalendarDate(value: string): boolean {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }
}
