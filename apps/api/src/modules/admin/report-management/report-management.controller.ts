import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';
import { Pagination } from '@/common/decorators/pagination.decorator';
import { ApiOffsetPaginatedResponse } from '@/common/decorators/swagger-response.decorator';
import type { OffsetPagination } from '@/common/helpers/offset-pagination.helper';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { ListReportsQueryDto } from "./dto/request/list-reports.query.dto";
import { ModerateReportRequestDto } from "./dto/request/moderate-report.request.dto";
import { ReportManagementService } from "./report-management.service";

type AuthenticatedRequest = { user?: { sub?: string } };

@ApiTags('Admin')
@ApiBearerAuth('bearer')
@UseGuards(AdminRoleGuard)
@Controller('admin/reports')
export class ReportManagementController {
  constructor(private readonly reportManagementService: ReportManagementService) {}

  @Get()
  @Message('Reports retrieved successfully')
  @ApiOperation({ summary: 'List reports' })
  @ApiOffsetPaginatedResponse({ description: 'Reports retrieved successfully' })
  async listReports(@Query() query: ListReportsQueryDto, @Pagination() pagination: OffsetPagination) {
    const result = await this.reportManagementService.listReports({
      page: pagination.page,
      limit: pagination.limit,
      type: query.type,
      status: query.status,
    });
    return { data: result.rows, pagination: result.pagination };
  }

  @Get(':reportId')
  @Message('Report details retrieved successfully')
  @ApiOperation({ summary: 'Get report details' })
  @ApiParam({ name: 'reportId' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Report details retrieved successfully' })
  getReportDetails(@Param('reportId') reportId: string) {
    return this.reportManagementService.getReportDetails(reportId);
  }

  @Patch(':reportId')
  @HttpCode(HttpStatus.OK)
  @Message('Report moderated successfully')
  @ApiOperation({ summary: 'Moderate a report' })
  @ApiParam({ name: 'reportId' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Report moderated successfully' })
  moderateReport(
    @Param('reportId') reportId: string,
    @Body() payload: ModerateReportRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.reportManagementService.moderateReport({
      reportId,
      action: payload.action,
      adminNote: payload.adminNote,
      adminId: request.user?.sub,
    });
  }
}
