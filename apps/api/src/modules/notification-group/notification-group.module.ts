import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PusherModule } from '../pusher/pusher.module';
import { NotificationController } from './controller/notification.controller';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationService } from './service/notification.service';

@Module({
  imports: [UserModule, PusherModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
})
export class NotificationGroupModule {}
