import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type {
  FindByUserIdRequest,
  FindByUsernameRequest,
  FindExistingIdsRequest,
  GetUserByEmailRequest,
  GetUserRequest,
} from '@purse/proto/generated/user';
import { USER_SERVICE, type UserService } from '../../../application/use-cases/user.service';

@Controller()
export class UserGrpcController {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(@Inject(USER_SERVICE) private readonly userService: UserService) { }

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
