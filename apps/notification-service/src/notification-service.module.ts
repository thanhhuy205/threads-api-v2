import { DatabaseModule } from '@api/shared/database';
import { JwtModule } from '@api/shared/jwt/jwt.module';
import { configurationFactory } from '@libs/core/config/configuration';
import { QUEUE_NAME } from '@libs/core/constants/queue';
import { RedisModule } from '@libs/core/src/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationDatabaseModule } from './database/database.module';
import { NotificationGroupModule } from './notification-group/notification-group.module';
import { PusherModule } from './pusher/pusher.module';
import { EmailWorker } from './workers/email.worker';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurationFactory],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_CONFIG.REDIS_HOST'),
          port: configService.get<number>('REDIS_CONFIG.REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAME.EMAIL_QUEUE },
      { name: QUEUE_NAME.NOTIFICATION_QUEUE },
    ),
    DatabaseModule,
    JwtModule,
    NotificationDatabaseModule,
    RedisModule,
    NotificationGroupModule,
    PusherModule,
  ],
  providers: [EmailWorker],
})
export class NotificationServiceModule { }
