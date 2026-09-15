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

  findByUsername(username: string): Promise<UserRef | null> {
    return firstValueFrom(this.userGrpcService.findByUsername({ username }));
  }
}
