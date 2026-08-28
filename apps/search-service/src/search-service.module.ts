import { configurationFactory } from '@/config/configuration';
import { DatabaseModule } from '@api/shared/database';
import { JwtModule } from '@api/shared/jwt/jwt.module';
import { AppAuthGuard } from '@libs/core/src/auth/guards/auth.guard';
import { GrpcGatewayAuthStrategy } from '@libs/core/src/auth/strategies/grpc-gate.startegies';
import { RedisModule } from '@libs/core/src/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SearchModule } from './modules/search/search.module';

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
    SearchModule,
  ],
  providers: [
    GrpcGatewayAuthStrategy,
    { provide: APP_GUARD, useClass: AppAuthGuard },
  ],
})
export class SearchServiceModule { }
