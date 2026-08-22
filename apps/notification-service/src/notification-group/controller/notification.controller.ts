import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { Message } from '@/common/decorators/message.decorator';
import { CursorPagination } from '@/common/decorators/cursor-pagination.decorator';
import { ApiCursorPaginatedResponse } from '@/common/decorators/swagger-response.decorator';
import type { CursorPagination as CursorPaginationParams } from '@/common/helpers/cursor-pagination.helper';
import { Controller, Get, HttpCode, HttpStatus, Inject, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationQueryDto } from '../dto/request/notification.query.dto';
import { NOTIFICATION_SERVICE, type NotificationService } from '../service/notification.service';

@ApiTags('Notification')
@ApiBearerAuth('bearer')
@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  @Message('Notifications retrieved')
  @ApiOperation({ summary: 'Get notifications for the current user' })
  @ApiCursorPaginatedResponse({ description: 'Notifications retrieved' })
  async getNotifications(
    @Query() _query: NotificationQueryDto,
    @CursorPagination() pagination: CursorPaginationParams,
    @GetUserId() userId: string,
  ) {
    const notifications = await this.notificationService.findAll({
      recipientId: userId,
      after: pagination.after ?? undefined,
      take: pagination.take,
    });
    return { data: notifications.rows, pagination: notifications.pagination };
  }

  @Get('unread')
  @Message('Notification unread status retrieved')
  @ApiOperation({ summary: 'Get unread notification status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notification unread status retrieved' })
  async getUnreadStatus(@GetUserId() userId: string) {
    const hasUnread = await this.notificationService.hasUnread(userId);
    return { isNotification: hasUnread };
  }

  @Post('read')
  @HttpCode(HttpStatus.OK)
  @Message('Notifications marked as read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notifications marked as read' })
  async markAsRead(@GetUserId() userId: string) {
    await this.notificationService.markGroupAsRead(userId);
    return { isRead: true };
  }
}
