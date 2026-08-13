import { Message } from '@/common/decorators/message.decorator';
import { CursorPagination } from '@/common/decorators/cursor-pagination.decorator';
import { ApiCursorPaginatedResponse } from '@/common/decorators/swagger-response.decorator';
import type { CursorPagination as CursorPaginationParams } from '@/common/helpers/cursor-pagination.helper';
import { IsPublic } from '@/common/decorators/is-public.decorator';
import { AUTH_MESSAGE, USER_MESSAGE } from '@/constants/message';
import { NotFoundException, UnauthorizedException } from '@/errors/error';
import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HttpRequest as Request } from '@/common/types/http.type';
import { FollowersQueryDto } from '../dto/request/followers.query.dto';
import { UsernameParamsDto } from '../dto/request';
import { FollowerService } from '../service/follower.service';
import { FriendService } from '../service/friend.service';
import { UserService } from '../service/user.service';

@ApiTags('User')
@Controller('user')
export class UserFollowController {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
    private readonly followerService: FollowerService,
  ) { }

  @Get(':username/followers')
  @IsPublic()
  @Message(USER_MESSAGE.GET_FOLLOWERS_SUCCESS)
  @ApiOperation({ summary: 'Get a user’s followers' })
  @ApiCursorPaginatedResponse({ description: USER_MESSAGE.GET_FOLLOWERS_SUCCESS })
  async getFollowers(@Param() params: UsernameParamsDto, @Query() _query: FollowersQueryDto, @CursorPagination() cursor: CursorPaginationParams) {
    const user = await this.userService.findByUsername(params.username);
    if (!user) throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
    const { users, pagination } = await this.followerService.getFollower({
      userId: user.id,
      after: cursor.after ?? undefined,
      take: cursor.take,
    });
    return { data: users, pagination };
  }

  @Get(':username/following')
  @IsPublic()
  @Message(USER_MESSAGE.GET_FOLLOWING_SUCCESS)
  @ApiOperation({ summary: 'Get users followed by a user' })
  @ApiCursorPaginatedResponse({ description: USER_MESSAGE.GET_FOLLOWING_SUCCESS })
  async getFollowing(@Param() params: UsernameParamsDto, @Query() _query: FollowersQueryDto, @CursorPagination() cursor: CursorPaginationParams) {
    const user = await this.userService.findByUsername(params.username);
    if (!user) throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
    const { users, pagination } = await this.followerService.getFollowing({
      userId: user.id,
      after: cursor.after ?? undefined,
      take: cursor.take,
    });
    return { data: users, pagination };
  }

  @Post(':username/friend-request')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @Message(USER_MESSAGE.FRIEND_REQUEST_SENT)
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({ status: HttpStatus.OK, description: USER_MESSAGE.FRIEND_REQUEST_SENT })
  sendFriendRequest(@Param() params: UsernameParamsDto, @Req() request: Request) {
    return this.friendService.sendFriendRequest(this.userId(request), params.username);
  }

  @Post(':username/follower')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @Message(USER_MESSAGE.FOLLOW_SUCCESS)
  @ApiOperation({ summary: 'Follow or unfollow a user' })
  @ApiResponse({ status: HttpStatus.OK, description: USER_MESSAGE.FOLLOW_SUCCESS })
  async follower(@Param() params: UsernameParamsDto, @Req() request: Request) {
    const targetUser = await this.userService.findByUsername(params.username);
    if (!targetUser) throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
    return this.followerService.follower(this.userId(request), targetUser.id);
  }

  private userId(request: Request): string {
    const userId = request.user?.sub;
    if (!userId) throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    return userId;
  }
}
