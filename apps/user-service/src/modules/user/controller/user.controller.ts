import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { Message } from '@/common/decorators/message.decorator';
import { Body, Controller, HttpStatus, Inject, Patch } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from '../dto/request/update-profile.request.dto';
import { USER_SERVICE, type UserService } from '../service/user.service';

@ApiTags('User')
@ApiBearerAuth('bearer')
@Controller('me')
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userService: UserService) { }

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

  @GrpcMethod('UserService', 'GetUserByEmail')
  async getUserByEmail(data: { email: string }) {
    return this.userService.findUserByEmail(data.email);
  }
}
