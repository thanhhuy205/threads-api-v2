import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HttpRequest as Request } from '@/common/types/http.type';
import { Message } from '@/common/decorators/message.decorator';
import { IsPublic } from '@/common/decorators/is-public.decorator';
import { AUTH_MESSAGE, USER_MESSAGE } from '@/constants/message';
import { NotFoundException, UnauthorizedException } from '@/errors/error';
import { JwtService } from '@/modules/jwt/service/jwt.service';
import { UserNameMentionQueryDto, UsernameParamsDto } from '../dto/request/username.params.dto';
import { UserService } from '../service/user.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
  async getMyStatusProfile(@Req() request: Request) {
    const userId = request.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
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
  async getByUsername(@Param() params: UsernameParamsDto, @Req() request: Request) {
    const userId = await this.jwtService.requestAuthToken(request);
    const user = await this.userService.findByUsername(params.username, userId ?? undefined);
    if (!user) {
      throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
    }
    return user;
  }
}
