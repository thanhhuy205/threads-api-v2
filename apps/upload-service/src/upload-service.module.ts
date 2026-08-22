import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { configurationFactory } from '@libs/core/config/configuration';
import { JobModule } from '@api/modules/job/job.module';
import { UploadDatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';

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
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_CONFIG.REDIS_HOST'),
          port: configService.get<number>('REDIS_CONFIG.REDIS_PORT'),
        },
      }),
    }),
    UploadDatabaseModule,
    JobModule,
    UploadModule,
  ],
})
export class UploadServiceModule {}
