import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';
import { Pagination } from '@/common/decorators/pagination.decorator';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { buildPagination } from '@/shared/pagination/pagination';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { ListUsersQueryDto } from "./dto/request/list-users.query.dto";
import { UserManagementService } from "./user-management.service";

type AuthenticatedRequest = { user?: { sub?: string } };

@ApiTags('Admin')
@ApiBearerAuth('bearer')
@UseGuards(AccessTokenGuard, AdminRoleGuard)
@Controller('admin/users')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get()
  @Pagination()
  @Message('Users retrieved successfully')
  @ApiOperation({ summary: 'List users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users retrieved successfully' })
  async listUsers(@Query() query: ListUsersQueryDto) {
    const { currentPage, currentLimit } = buildPagination(query);
    const result = await this.userManagementService.getAllUsers({
      page: currentPage,
      limit: currentLimit,
    });
    return { data: result.rows, pagination: result.pagination };
  }

  @Patch(':userId/unban')
  @HttpCode(HttpStatus.OK)
  @Message('User unbanned successfully')
  @ApiOperation({ summary: 'Unban a user' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User unbanned successfully' })
  async unbanUser(@Param('userId') userId: string, @Req() request: AuthenticatedRequest) {
    return this.userManagementService.unbanUser({
      userId,
      adminId: request.user?.sub,
    });
  }

  @Patch(':userId/ban-unlimited')
  @HttpCode(HttpStatus.OK)
  @Message('User banned indefinitely successfully')
  @ApiOperation({ summary: 'Ban a user indefinitely' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User banned indefinitely successfully' })
  async banUserUnlimited(@Param('userId') userId: string, @Req() request: AuthenticatedRequest) {
    return this.userManagementService.banUserUnlimited({
      userId,
      adminId: request.user?.sub,
    });
  }
}
