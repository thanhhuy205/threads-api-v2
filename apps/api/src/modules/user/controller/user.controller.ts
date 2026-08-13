import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HttpRequest as Request } from '@/common/types/http.type';
import { Message } from '@/common/decorators/message.decorator';
import { CursorPagination } from '@/common/decorators/cursor-pagination.decorator';
import { ApiCursorPaginatedResponse } from '@/common/decorators/swagger-response.decorator';
import type { CursorPagination as CursorPaginationParams } from '@/common/helpers/cursor-pagination.helper';
import { AUTH_MESSAGE, USER_MESSAGE } from '@/constants/message';
import { UnauthorizedException } from '@/errors/error';
import { FollowersQueryDto } from '../dto/request/followers.query.dto';
import { FriendRequestDto } from '../dto/request/friend-id.params.dto';
import { FriendRequestParamsDto } from '../dto/request';
import { UpdateProfileDto } from '../dto/request/update-profile.request.dto';
import { FriendService } from '../service/friend.service';
import { FollowerService } from '../service/follower.service';
import { UserService } from '../service/user.service';

@ApiTags('User')
@ApiBearerAuth('bearer')
@Controller('me')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
    private readonly followerService: FollowerService,
  ) {}

  @Patch('profile')
  @Message('Profile updated successfully')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully' })
  updateProfile(@Body() payload: UpdateProfileDto, @Req() request: Request) {
    return this.userService.updateProfile(this.userId(request), payload);
  }

  @Get('followers')
  @Message(USER_MESSAGE.GET_FOLLOWERS_SUCCESS)
  @ApiOperation({ summary: 'Get followers of the current user' })
  @ApiCursorPaginatedResponse({ description: USER_MESSAGE.GET_FOLLOWERS_SUCCESS })
  async getMyFollowers(@Query() _query: FollowersQueryDto, @CursorPagination() cursor: CursorPaginationParams, @Req() request: Request) {
    const { users, pagination } = await this.followerService.getFollower({
      userId: this.userId(request),
      after: cursor.after ?? undefined,
      take: cursor.take,
    });
    return { data: users, pagination };
  }

  @Post(':username/friend-requests')
  @HttpCode(HttpStatus.OK)
  @Message(USER_MESSAGE.FRIEND_REQUEST_SENT)
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({ status: HttpStatus.OK, description: USER_MESSAGE.FRIEND_REQUEST_SENT })
  sendFriendRequest(@Param() params: FriendRequestParamsDto, @Req() request: Request) {
    return this.friendService.sendFriendRequest(this.userId(request), params.username);
  }

  @Patch('friend-requests/:username/cancel')
  @Message(USER_MESSAGE.FRIEND_REQUEST_PROCESSED)
  @ApiOperation({ summary: 'Cancel a friend request' })
  @ApiResponse({ status: HttpStatus.OK, description: USER_MESSAGE.FRIEND_REQUEST_PROCESSED })
  async handleFriendRequestCancel(@Param() params: FriendRequestParamsDto, @Req() request: Request) {
    await this.friendService.handleFriendRequestCancel(this.userId(request), params.username);
    return null;
  }

  @Patch('friend-requests/:username/accept')
  @Message(USER_MESSAGE.FRIEND_REQUEST_PROCESSED)
  @ApiOperation({ summary: 'Accept or reject a friend request' })
  @ApiResponse({ status: HttpStatus.OK, description: USER_MESSAGE.FRIEND_REQUEST_PROCESSED })
  async handleFriendRequestAccept(
    @Param() params: FriendRequestParamsDto,
    @Body() payload: FriendRequestDto,
    @Req() request: Request,
  ) {
    await this.friendService.handleFriendRequestAccept(
      this.userId(request),
      params.username,
      payload.isAccept,
    );
    return null;
  }

  @Get('friend-requests/received')
  @Message(USER_MESSAGE.GET_RECEIVED_FRIEND_REQUESTS_SUCCESS)
  @ApiOperation({ summary: 'Get received friend requests' })
  @ApiCursorPaginatedResponse({ description: USER_MESSAGE.GET_RECEIVED_FRIEND_REQUESTS_SUCCESS })
  async getReceivedFriendRequests(@Query() _query: FollowersQueryDto, @CursorPagination() cursor: CursorPaginationParams, @Req() request: Request) {
    const { rows, pagination } = await this.friendService.getReceivedFriendRequests({
      take: cursor.take,
      receiverId: this.userId(request),
      senderId: cursor.after ?? undefined,
    });
    return { data: rows, pagination };
  }

  @Get('friend-requests/sent')
  @Message(USER_MESSAGE.GET_SENT_FRIEND_REQUESTS_SUCCESS)
  @ApiOperation({ summary: 'Get sent friend requests' })
  @ApiCursorPaginatedResponse({ description: USER_MESSAGE.GET_SENT_FRIEND_REQUESTS_SUCCESS })
  async getSentFriendRequests(@Query() _query: FollowersQueryDto, @CursorPagination() cursor: CursorPaginationParams, @Req() request: Request) {
    const { rows, pagination } = await this.friendService.getSentFriendRequests({
      take: cursor.take,
      senderId: this.userId(request),
      receiverId: cursor.after ?? undefined,
    });
    return { data: rows, pagination };
  }

  private userId(request: Request): string {
    const userId = request.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    return userId;
  }
}
