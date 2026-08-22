import { CronModule } from '@api/modules/cron/schedule-overview.module';
import { LikeRepositoryImpl } from '@api/modules/post/repository/impl/like.repository.impl';
import { PostRepositoryImpl } from '@api/modules/post/repository/impl/post.repository.impl';
import { LIKE_REPOSITORY } from '@api/modules/post/repository/like.repository';
import { POST_REPOSITORY } from '@api/modules/post/repository/post.repository';
import { LikeServiceImpl } from '@api/modules/post/service/impl/like.service.impl';
import { LIKE_SERVICE } from '@api/modules/post/service/like.service';
import { PostMediaRepository } from '@upload/repository/post-media.repository';
import { RedisModule } from '@libs/cache/redis.module';
import { configurationFactory } from '@libs/core/config/config';
import { QUEUE_NAME } from '@libs/core/constants/queue';
import { DatabaseModule } from '@api/shared/database';
import { UploadDatabaseModule } from '@upload-service/database/database.module';
import { CloudflareModule } from '@upload-service/storage/cloudflare.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BloomWorker } from './bloom.worker';
import { HlsWorker } from './hls.worker';
import { LikeWorker } from './like.worker';
// import { SurveySyncWorker } from './survey-sync.worker';


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
          }
        }
      }
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAME.BLOOM_QUEUE },
      { name: QUEUE_NAME.LIKE_QUEUE },
      // { name: QUEUE_NAME.VIDEO_QUEUE },
      // { name: QUEUE_NAME.SURVEY_SYNC_QUEUE },
    ),
    DatabaseModule,
    UploadDatabaseModule,
    RedisModule,
    CloudflareModule,
    CronModule,
  ],
  providers: [
    BloomWorker,
    HlsWorker,
    LikeWorker,
    // SurveySyncWorker,
    PostMediaRepository,
    { provide: POST_REPOSITORY, useClass: PostRepositoryImpl },
    { provide: LIKE_REPOSITORY, useClass: LikeRepositoryImpl },
    { provide: LIKE_SERVICE, useClass: LikeServiceImpl },
  ],
})
export class AppModule { }
