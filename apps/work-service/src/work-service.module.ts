import { DatabaseModule } from '@api/shared/database';
import { configurationFactory } from '@libs/core/config/config';
import { QUEUE_NAME } from '@libs/core/constants/queue';
import { RedisModule } from '@libs/core/src/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LikeRepositoryImpl } from '@post-service/modules/post/repository/impl/like.repository.impl';
import { PostRepositoryImpl } from '@post-service/modules/post/repository/impl/post.repository.impl';
import { LIKE_REPOSITORY } from '@post-service/modules/post/repository/like.repository';
import { POST_REPOSITORY } from '@post-service/modules/post/repository/post.repository';
import { LikeServiceImpl } from '@post-service/modules/post/service/impl/like.service.impl';
import { LIKE_SERVICE } from '@post-service/modules/post/service/like.service';
import { UploadDatabaseModule } from '@upload-service/database/database.module';
import { CloudflareModule } from '@upload-service/storage/cloudflare.module';
import { PostMediaRepository } from '@upload/repository/post-media.repository';
import { BloomWorker } from './bloom.worker';
import { HlsWorker } from './hls.worker';
import { LikeWorker } from './like.worker';

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
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_CONFIG.REDIS_HOST'),
          port: configService.get('REDIS_CONFIG.REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAME.BLOOM_QUEUE },
      { name: QUEUE_NAME.LIKE_QUEUE },
    ),
    DatabaseModule,
    UploadDatabaseModule,
    RedisModule,
    CloudflareModule,
  ],
  providers: [
    BloomWorker,
    HlsWorker,
    LikeWorker,
    PostMediaRepository,
    { provide: POST_REPOSITORY, useClass: PostRepositoryImpl },
    { provide: LIKE_REPOSITORY, useClass: LikeRepositoryImpl },
    { provide: LIKE_SERVICE, useClass: LikeServiceImpl },
  ],
})
export class WorkServiceModule { }
