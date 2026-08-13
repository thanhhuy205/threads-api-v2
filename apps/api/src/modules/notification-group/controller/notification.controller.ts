import { Message } from '@/common/decorators/message.decorator';
import { CursorPagination } from '@/common/decorators/cursor-pagination.decorator';
import { ApiCursorPaginatedResponse } from '@/common/decorators/swagger-response.decorator';
import type { CursorPagination as CursorPaginationParams } from '@/common/helpers/cursor-pagination.helper';
import { AUTH_MESSAGE } from '@/constants/message';
import { UnauthorizedException } from '@/errors/error';
import { Controller, Get, HttpCode, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HttpRequest as Request } from '@/common/types/http.type';
import { NotificationQueryDto } from '../dto/request/notification.query.dto';
import { NotificationService } from '../service/notification.service';

@ApiTags('Notification')
@ApiBearerAuth('bearer')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Message('Notifications retrieved')
  @ApiOperation({ summary: 'Get notifications for the current user' })
  @ApiCursorPaginatedResponse({ description: 'Notifications retrieved' })
  async getNotifications(@Query() _query: NotificationQueryDto, @CursorPagination() pagination: CursorPaginationParams, @Req() request: Request) {
    const notifications = await this.notificationService.findAll({
      recipientId: this.userId(request),
      after: pagination.after ?? undefined,
      take: pagination.take,
    });
    return { data: notifications.rows, pagination: notifications.pagination };
  }

  @Get('unread')
  @Message('Notification unread status retrieved')
  @ApiOperation({ summary: 'Get unread notification status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notification unread status retrieved' })
  async getUnreadStatus(@Req() request: Request) {
    const hasUnread = await this.notificationService.hasUnread(this.userId(request));
    return { isNotification: hasUnread };
  }

  @Post('read')
  @HttpCode(HttpStatus.OK)
  @Message('Notifications marked as read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notifications marked as read' })
  async markAsRead(@Req() request: Request) {
    await this.notificationService.markGroupAsRead(this.userId(request));
    return { isRead: true };
  }

  private userId(request: Request): string {
    const userId = request.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    return userId;
  }
}
