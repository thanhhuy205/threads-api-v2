import { Body, Controller, Get, HttpCode, HttpStatus, Inject, NotFoundException, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_MESSAGE, USER_MESSAGE } from '@purse/common/constants';
import { GetUserId, Message } from '@purse/common/decorators';
import { UnauthorizedException } from '@purse/common/errors';
import { USER_SERVICE, type UserService } from '../../../application/use-cases/user.service';
import { OnboardingDto } from './dto/request/onboarding.request.dto';
import { UpdateProfileDto } from './dto/request/update-profile.request.dto';
import {
  CurrentUserProfileResponseDto,
  OnboardingResponseDto,
  StatusProfileResponseDto,
  UpdateProfileResponseDto,
} from './dto/response';

@ApiTags('Profile')
@Controller('users')
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userService: UserService) { }

  @Post('profile')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.UPDATE_USER_SUCCESS)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AUTH_MESSAGE.UPDATE_USER_SUCCESS,
    type: UpdateProfileResponseDto,
  })
  updateProfile(
    @Body() payload: UpdateProfileDto,
    @GetUserId() userId: string,
  ) {
    return this.userService.updateProfile({ identity: userId, ...payload });
  }

  @Post('onboarding')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.UPDATE_USER_SUCCESS)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Complete the authenticated user onboarding' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AUTH_MESSAGE.UPDATE_USER_SUCCESS,
    type: OnboardingResponseDto,
  })
  onboarding(
    @Body() payload: OnboardingDto,
    @GetUserId() userId: string,
  ) {
    return this.userService.onboarding({ identity: userId, ...payload });
  }

  @Get('me')
  @Message(AUTH_MESSAGE.GET_ME_SUCCESS)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AUTH_MESSAGE.GET_ME_SUCCESS,
    type: CurrentUserProfileResponseDto,
  })
  async me(@GetUserId() userId: string) {
    const user = await this.userService.me({ identity: userId });
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    return user;
  }
  @Get('me/status-profile')
  @ApiBearerAuth('bearer')
  @Message('User status profile retrieved successfully')
  @ApiOperation({ summary: 'Get profile completion status for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User status profile retrieved successfully',
    type: StatusProfileResponseDto,
  })
  async getMyStatusProfile(@GetUserId() userId: string) {
    const statusProfile = await this.userService.getMyStatusProfile(userId);
    if (!statusProfile) {
      throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
    }
    return statusProfile;
  }
}
