import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { configurationFactory } from '@/config/configuration';
import { RedisModule } from '@libs/cache/redis.module';
import { DatabaseModule } from '@libs/database';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { GroupTeamModule } from './modules/group-team/group-team.module';
import { HealthModule } from './modules/health/health.module';
import { JobModule } from './modules/job/job.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { NotificationGroupModule } from './modules/notification-group/notification-group.module';
import { PollModule } from './modules/poll/poll.module';
import { PostModule } from './modules/post/post.module';
import { PusherModule } from './modules/pusher/pusher.module';
import { SearchModule } from './modules/search/search.module';
import { TopicModule } from './modules/topic/topic.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurationFactory],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          connection: {
            host: configService.get("REDIS_CONFIG.REDIS_HOST"),
            port: configService.get("REDIS_CONFIG.REDIS_PORT"),
          },
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          },
        }
      }
    }),
    DatabaseModule,
    RedisModule,
    JwtModule,
    JobModule,
    AuthModule,
    HealthModule,
    GroupTeamModule,
    AiModule,
    UserModule,
    PollModule,
    TopicModule,
    SearchModule,
    NotificationGroupModule,
    PusherModule,
    UploadModule,
    AdminModule,
    PostModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },

  ],
})
export class AppModule { }
