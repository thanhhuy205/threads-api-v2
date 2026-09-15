import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { configurationFactory, jwtConfiguration } from '@purse/common/config';
import { JwtAlgorithm } from '@purse/common/enums';
import { AppAuthGuard, GrpcGatewayAuthStrategy } from '@purse/core/auth';
import { RedisModule } from '@purse/core/redis';
import { validate } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, cache: true,
      validate,
      load: [configurationFactory]
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
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfiguration)],
      global: true,
      useFactory: async (
        jwtConfig: ConfigType<typeof jwtConfiguration>,
      ) => ({
        secret: jwtConfig.secret,
        signOptions: {
          algorithm: jwtConfig.algorithm as JwtAlgorithm,
          issuer: jwtConfig.issuer,
        },
      }),

      inject: [jwtConfiguration.KEY],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
  ],
  providers: [
    GrpcGatewayAuthStrategy,
    { provide: APP_GUARD, useClass: AppAuthGuard },
  ],
})
export class AppModule { }
