import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { NotificationController } from './controller/notification.controller';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationService } from './service/notification.service';

@Module({
  imports: [UserModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, AccessTokenGuard],
})
export class NotificationGroupModule {}
