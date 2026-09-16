import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type {
  UserReader,
  UserRef,
} from '../../modules/post/ports/user-reader.port';
import type { UserGrpcService } from './user-grpc-client.type';
import { USER_GRPC_CLIENT } from './user.tokens';

@Injectable()
export class GrpcUserReader implements UserReader, OnModuleInit {
  private userGrpcService!: UserGrpcService;

  constructor(
    @Inject(USER_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userGrpcService =
      this.client.getService<UserGrpcService>('UserService');
  }

  async findExistingIds(userIds: string[]): Promise<string[]> {
    const response = await firstValueFrom(
      this.userGrpcService.findExistingIds({ userIds }),
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
    return firstValueFrom(this.userGrpcService.findByUserId({ userId }));
  }
}
