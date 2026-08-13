import { Body, Controller, HttpStatus, Patch, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HttpRequest as Request } from '@/common/types/http.type';
import { Message } from '@/common/decorators/message.decorator';
import { AUTH_MESSAGE, USER_MESSAGE } from '@/constants/message';
import { UnauthorizedException } from '@/errors/error';
import { UpdateProfileDto } from '../dto/request/update-profile.request.dto';
import { UserService } from '../service/user.service';

@ApiTags('User')
@ApiBearerAuth('bearer')
@Controller('me')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('profile')
  @Message('Profile updated successfully')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully' })
  updateProfile(@Body() payload: UpdateProfileDto, @Req() request: Request) {
    return this.userService.updateProfile(this.userId(request), payload);
  }

  private userId(request: Request): string {
    const userId = request.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    return userId;
  }
}
