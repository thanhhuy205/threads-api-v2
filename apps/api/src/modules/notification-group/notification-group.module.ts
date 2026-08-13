import { UserModule } from '@api/modules/user/user.module';
import { Module } from '@nestjs/common';
import { PusherModule } from '../pusher/pusher.module';
import { NotificationController } from './controller/notification.controller';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationService } from './service/notification.service';

@Module({
  imports: [PusherModule, UserModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
})
export class NotificationGroupModule { }
