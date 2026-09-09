import { configurationFactory } from '@/config/configuration';
import { AppAuthGuard } from '@libs/core/src/auth/guards/auth.guard';
import { GrpcGatewayAuthStrategy } from '@libs/core/src/auth/strategies/grpc-gate.startegies';
import { RedisModule } from '@libs/core/src/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GroupTeamModule } from './modules/group-team/group-team.module';
import { HistoryPositionModule } from './modules/history-position/history-position.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { validate } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate, load: [configurationFactory] }),
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
    UserModule,
    HistoryPositionModule,
    GroupTeamModule,
  ],
  providers: [
    GrpcGatewayAuthStrategy,
    { provide: APP_GUARD, useClass: AppAuthGuard },
  ],
})
export class AppModule { }
