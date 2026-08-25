import { UserModule } from '@user-service/modules/user/user.module';
import { Module } from '@nestjs/common';
import { PusherModule } from '@notification-service/pusher/pusher.module';
import { NotificationController } from './controller/notification.controller';
import { NotificationRepositoryImpl } from './repository/impl/notification.repository.impl';
import { NOTIFICATION_REPOSITORY } from './repository/notification.repository';
import { NotificationServiceImpl } from './service/impl/notification.service.impl';
import { NOTIFICATION_SERVICE } from './service/notification.service';

@Module({
  imports: [PusherModule, UserModule],
  controllers: [NotificationController],
  providers: [
    { provide: NOTIFICATION_REPOSITORY, useClass: NotificationRepositoryImpl },
    { provide: NOTIFICATION_SERVICE, useClass: NotificationServiceImpl },
  ],
})
export class NotificationGroupModule { }
