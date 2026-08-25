import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { configurationFactory } from '@/config/configuration';
import { RedisModule } from '@libs/cache/redis.module';
import { DatabaseModule } from '@api/shared/database';
import { JwtModule } from '@api/shared/jwt/jwt.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';
import { AbilityModule } from './modules/ability/ability.module';
import { AuthModule } from './modules/auth/auth.module';
import { JobModule } from '@api/modules/job/job.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [configurationFactory] }),
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
    DatabaseModule,
    RedisModule,
    JwtModule,
    JobModule,
    AbilityModule,
    AdminModule,
    AuthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AuthServiceModule {}
