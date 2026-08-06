import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurationFactory } from './config/configuration';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';

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
  ],
})
export class AppModule {}
