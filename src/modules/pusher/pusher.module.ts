import { Module } from '@nestjs/common';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { PusherController } from './controller/pusher.controller';
import { PusherService } from './service/pusher.service';

@Module({
  controllers: [PusherController],
  providers: [PusherService, AccessTokenGuard],
  exports: [PusherService],
})
export class PusherModule {}
