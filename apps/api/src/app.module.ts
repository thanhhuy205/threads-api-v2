import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { configurationFactory } from '@/config/configuration';
import { RedisModule } from '@libs/cache/redis.module';
import { DatabaseModule } from '@/shared/database';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';
import { JobModule } from './modules/job/job.module';
import { JwtModule } from './shared/jwt/jwt.module';

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
    HealthModule,
    AiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },

  ],
})
export class AppModule { }
