import { Body, Controller, HttpStatus, Inject, Logger, Patch } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserId, Message } from '@purse/common/decorators';
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
  private readonly logger = new Logger(UserController.name);

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
    this.logger.debug(
      `[gRPC] FindExistingIds received keys=${Object.keys(data ?? {}).join(',')} userIdsIsArray=${Array.isArray(data?.userIds)} count=${Array.isArray(data?.userIds) ? data.userIds.length : 'undefined'}`,
    );
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
    this.logger.debug(
      `[gRPC] FindByUserId received keys=${Object.keys(data ?? {}).join(',')} hasUserId=${typeof data?.userId === 'string' && data.userId.length > 0}`,
    );
    return this.userService.findByUserId(data.userId);
  }

  @GrpcMethod('UserService', 'FindByUsername')
  findByUsername(data: FindByUsernameRequest) {
    return this.userService.findByUsername(data.username);
  }
}
