import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { configurationFactory } from '@/config/configuration';
import { RedisModule } from '@libs/cache/redis.module';
import { DatabaseModule } from '@libs/database';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { GroupTeamModule } from './modules/group-team/group-team.module';
import { JobModule } from './modules/job/job.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { NotificationGroupModule } from './modules/notification-group/notification-group.module';
import { PollModule } from './modules/poll/poll.module';
import { PostModule } from './modules/post/post.module';
import { PusherModule } from './modules/pusher/pusher.module';
import { ReportModule } from './modules/report/report.module';
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
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
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
    ReportModule,
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
