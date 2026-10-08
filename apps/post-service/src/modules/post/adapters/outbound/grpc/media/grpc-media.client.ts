import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, type Observable } from 'rxjs';
import type { ConnectMediaCommand } from '../../../../application/commands/connect-media.command';
import type { MediaPort } from '../../../../application/ports/outbound/media.ports';

export const MEDIA_GRPC_CLIENT = Symbol('MEDIA_GRPC_CLIENT');

interface GrpcMediaService {
  connectMedia(data: ConnectMediaCommand): Observable<void>;
}

@Injectable()
export class GrpcMediaClient implements MediaPort, OnModuleInit {
  private grpcMediaService!: GrpcMediaService;

  constructor(
    @Inject(MEDIA_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) { }

  onModuleInit(): void {
    this.grpcMediaService = this.client.getService('MediaService');
  }

  async connectMedia(command: ConnectMediaCommand): Promise<void> {
    if (command.mediaIds.length === 0) return;

    await firstValueFrom(this.grpcMediaService.connectMedia(command));
  }
}
