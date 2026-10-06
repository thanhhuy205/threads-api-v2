import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { configurationFactory } from '@purse/common/config';
import { TransformInterceptor } from '@purse/common/interceptors';
import { AppAuthGuard, GrpcGatewayAuthStrategy } from '@purse/core/auth';
import { RedisModule } from '@purse/core/redis';
import { createLoggerOptions, LoggerModule } from '@purse/observability/logging';
import { validate } from './config/app.config';
import { keycloakApiConfiguration } from './config/keycloak-api.config';
import { BillingModule } from './modules/billing/billing.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [
    LoggerModule.forRoot(createLoggerOptions('account-service')),
    ConfigModule.forRoot({
      isGlobal: true, cache: true,
      validate,
      load: [configurationFactory, keycloakApiConfiguration],
      envFilePath: [
        process.cwd() + '/.env',
        '.env',
      ]
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
    ProfileModule,
    UserModule,
    BillingModule,
  ],
  providers: [
    GrpcGatewayAuthStrategy,
    { provide: 'TransformInterceptor', useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: AppAuthGuard },
  ],
})
export class AppModule { }
