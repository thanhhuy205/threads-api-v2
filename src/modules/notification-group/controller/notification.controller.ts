import { Message } from '@/common/decorators/message.decorator';
import { Pagination } from '@/common/decorators/pagination.decorator';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { AUTH_MESSAGE } from '@/constants/message';
import { UnauthorizedException } from '@/errors/error';
import { buildPagination } from '@/shared/pagination/cursor-pagination';
import { Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { NotificationQueryDto } from '../dto/request/notification.query.dto';
import { NotificationService } from '../service/notification.service';

@ApiTags('Notification')
@ApiBearerAuth('bearer')
@UseGuards(AccessTokenGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Pagination()
  @Message('Notifications retrieved')
  @ApiOperation({ summary: 'Get notifications for the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notifications retrieved' })
  async getNotifications(@Query() query: NotificationQueryDto, @Req() request: Request) {
    const { currentAfter, currentLimit } = buildPagination(query);
    const notifications = await this.notificationService.findAll({
      recipientId: this.userId(request),
      after: currentAfter ?? undefined,
      take: currentLimit,
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

  @Get('friend-request')
  @Message('Friend request count retrieved')
  @ApiOperation({ summary: 'Get received friend request count' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Friend request count retrieved' })
  async getFriendRequestCount(@Req() request: Request) {
    const friendRequestCount = await this.notificationService.countReceivedFriendRequests(this.userId(request));
    return { friendRequestCount };
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
