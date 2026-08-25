import { Module } from '@nestjs/common';
import { PusherController } from './controller/pusher.controller';
import { PusherService } from './service/pusher.service';

@Module({
  controllers: [PusherController],
  providers: [PusherService],
  exports: [PusherService],
})
export class PusherModule { }
