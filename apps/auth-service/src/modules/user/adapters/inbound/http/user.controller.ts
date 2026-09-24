import { Body, Controller, HttpStatus, Inject, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserId, Message } from '@purse/common/decorators';
import { USER_SERVICE, type UserService } from '../../../application/use-cases/user.service';
import { UpdateProfileDto } from './dto/request/update-profile.request.dto';

@ApiTags('User')
@ApiBearerAuth('bearer')
@Controller('me')
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userService: UserService) {}

  @Patch('profile')
  @Message('Profile updated successfully')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully' })
  updateProfile(
    @Body() payload: UpdateProfileDto,
    @GetUserId() userId: string,
  ) {
    return this.userService.updateProfile(userId, payload);
  }
}
