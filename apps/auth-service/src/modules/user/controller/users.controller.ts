import { GetOptionalUserId, GetUserId, IsPublic, Message } from '@purse/common/decorators';
import { NotFoundException } from '@purse/common/errors';
import { USER_MESSAGE } from '@purse/common/constants';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserNameMentionQueryDto, UsernameParamsDto } from '../dto/request';
import { USER_SERVICE, type UserService } from '../service/user.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) { }

  @Get('mention')
  @IsPublic()
  @Message('Usernames retrieved successfully')
  @ApiOperation({ summary: 'Search usernames for mentions' })
  @ApiResponse({ status: 200, description: 'Usernames retrieved successfully' })
  getUsernames(@Query() query: UserNameMentionQueryDto) {
    if (query.q.length === 1) {
      return this.userService.searchUsernameOneQuery({ query: query.q });
    }
    return this.userService.searchUsername({ query: query.q });
  }

  @Get('me/status-profile')
  @ApiBearerAuth('bearer')
  @Message('User status profile retrieved successfully')
  @ApiOperation({ summary: 'Get profile completion status for the current user' })
  @ApiResponse({ status: 200, description: 'User status profile retrieved successfully' })
  async getMyStatusProfile(@GetUserId() userId: string) {
    const statusProfile = await this.userService.getMyStatusProfile(userId);
    if (!statusProfile) {
      throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
    }
    return statusProfile;
  }

  @Get(':username')
  @IsPublic()
  @Message(USER_MESSAGE.GET_USER_SUCCESS)
  @ApiOperation({ summary: 'Get a user profile by username' })
  @ApiResponse({ status: 200, description: USER_MESSAGE.GET_USER_SUCCESS })
  @ApiResponse({ status: 404, description: USER_MESSAGE.USER_NOT_FOUND })
  async getByUsername(@Param() params: UsernameParamsDto, @GetOptionalUserId() userId?: string) {
    const user = await this.userService.findByUsername(params.username, userId);
    if (!user) {
      throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
    }
    return user;
  }
}
