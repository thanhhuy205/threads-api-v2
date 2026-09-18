import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { configurationFactory } from '@purse/common/config';
import { AppAuthGuard, GrpcGatewayAuthStrategy } from '@purse/core/auth';
import { RedisModule } from '@purse/core/redis';
import { createLoggerOptions, LoggerModule } from '@purse/observability/logging';
import { resolve } from 'node:path';
import { databaseConfiguration, validate } from './config';
import { PostModule } from './modules/post/post.module';
// MAINTENANCE: import { PollModule } from './modules/poll/poll.module';
// MAINTENANCE: import { TopicModule } from './modules/topic/topic.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    LoggerModule.forRoot(createLoggerOptions('post-service')),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: resolve(process.cwd(), '.env'),
      validate,
      load: [configurationFactory, databaseConfiguration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('REDIS_CONFIG.REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_CONFIG.REDIS_PORT'),
        },
      }),
    }),
    PrismaModule,
    RedisModule,
    // MAINTENANCE: PollModule,
    // MAINTENANCE: TopicModule,
    PostModule,
  ],
  providers: [
    GrpcGatewayAuthStrategy,
    { provide: APP_GUARD, useClass: AppAuthGuard },
  ],
})
export class AppModule { }
