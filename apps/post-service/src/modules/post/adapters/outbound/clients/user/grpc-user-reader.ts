import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type {
  UserReader,
  UserRef,
} from '../../../../application/ports/outbound/user-reader.port';
import type { UserGrpcService } from './user-grpc-client.type';
import { USER_GRPC_CLIENT } from './user.tokens';

@Injectable()
export class GrpcUserReader implements UserReader, OnModuleInit {
  private readonly logger = new Logger(GrpcUserReader.name);
  private userGrpcService!: UserGrpcService;

  constructor(
    @Inject(USER_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) { }

  onModuleInit(): void {
    this.userGrpcService =
      this.client.getService<UserGrpcService>('UserService');
  }

  async findExistingIds(userIds: string[]): Promise<string[]> {
    this.logger.debug(
      `[gRPC] FindExistingIds sending userIdsIsArray=${Array.isArray(userIds)} count=${Array.isArray(userIds) ? userIds.length : 'undefined'}`,
    );
    const response = await firstValueFrom(
      this.userGrpcService.findExistingIds({ userIds }),
    );
    this.logger.debug(
      `[gRPC] FindExistingIds received count=${response.userIds.length}`,
    );
    return response.userIds;
  }

  getUser(userId: string): Promise<UserRef | null> {
    return firstValueFrom(this.userGrpcService.getUser({ id: userId }));
  }

  getUserByEmail(email: string): Promise<UserRef | null> {
    return firstValueFrom(this.userGrpcService.getUserByEmail({ email }));
  }

  findByUsername(username: string): Promise<UserRef | null> {
    return firstValueFrom(this.userGrpcService.findByUsername({ username }));
  }

  findByUserId(userId: string): Promise<UserRef | null> {
    this.logger.debug(
      `[gRPC] FindByUserId sending hasUserId=${typeof userId === 'string' && userId.length > 0}`,
    );
    return firstValueFrom(this.userGrpcService.findByUserId({ userId }));
  }
}
