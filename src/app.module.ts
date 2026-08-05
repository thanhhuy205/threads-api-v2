import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurationFactory } from './config/configuration';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurationFactory],
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
