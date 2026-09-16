import { GetUserId, Message } from '@purse/common/decorators';
import { Body, Controller, HttpStatus, Inject, Patch } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type {
  FindByUserIdRequest,
  FindByUsernameRequest,
  FindExistingIdsRequest,
  GetUserByEmailRequest,
  GetUserRequest,
} from '@purse/proto/generated/user';
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

  @GrpcMethod('UserService', 'FindExistingIds')
  async findExistingIds(data: FindExistingIdsRequest) {
    return { userIds: await this.userService.findExistingIds(data.userIds) };
  }

  @GrpcMethod('UserService', 'GetUser')
  getUser(data: GetUserRequest) {
    return this.userService.findByUserId(data.id);
  }

  @GrpcMethod('UserService', 'GetUserByEmail')
  getUserByEmail(data: GetUserByEmailRequest) {
    return this.userService.findUserByEmail(data.email);
  }

  @GrpcMethod('UserService', 'FindByUserId')
  findByUserId(data: FindByUserIdRequest) {
    return this.userService.findByUserId(data.userId);
  }

  @GrpcMethod('UserService', 'FindByUsername')
  findByUsername(data: FindByUsernameRequest) {
    return this.userService.findByUsername(data.username);
  }
}
