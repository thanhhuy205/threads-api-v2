import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_MESSAGE } from '@purse/common/constants';
import { GetUserId, Message } from '@purse/common/decorators';
import { UnauthorizedException } from '@purse/common/errors';
import { USER_SERVICE, type UserService } from '../../../application/use-cases/user.service';
import { UpdateProfileDto } from './dto/request/update-profile.request.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userService: UserService) {}

  @Post('profile')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.UPDATE_USER_SUCCESS)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: AUTH_MESSAGE.UPDATE_USER_SUCCESS })
  updateProfile(
    @Body() payload: UpdateProfileDto,
    @GetUserId() userId: string,
  ) {
    return this.userService.updateProfile(userId, payload);
  }

  @Get('me')
  @Message(AUTH_MESSAGE.GET_ME_SUCCESS)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiResponse({ status: HttpStatus.OK, description: AUTH_MESSAGE.GET_ME_SUCCESS })
  async me(@GetUserId() userId: string) {
    const user = await this.userService.me(userId);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    return user;
  }
}
