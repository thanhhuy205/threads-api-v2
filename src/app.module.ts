import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurationFactory } from './config/configuration';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';
import { PollModule } from './modules/poll/poll.module';
import { SearchModule } from './modules/search/search.module';
import { TopicModule } from './modules/topic/topic.module';
import { NotificationGroupModule } from './modules/notification-group/notification-group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurationFactory],
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    AiModule,
    UserModule,
    PollModule,
    TopicModule,
    SearchModule,
    NotificationGroupModule,
  ],
})
export class AppModule {}
