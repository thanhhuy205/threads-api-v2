import { LikeRepository } from '@api/modules/post/repository/like.repository';
import { PostRepository } from '@api/modules/post/repository/post.repository';
import { LikeService } from '@api/modules/post/service/like-service.service';
import { ReportRepository } from '@api/modules/report/repository/report.repository';
import { PostMediaRepository } from '@api/modules/upload/repository/post-media.repository';
import { configurationFactory } from '@libs/core/config/config';
import { QUEUE_NAME } from '@libs/core/constants/queue';
import { RedisModule } from '@libs/cache/redis.module';
import { DatabaseModule } from '@libs/database';
import { CloudflareModule } from '@libs/storage/cloudflare.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BloomWorker } from './bloom.worker';
import { EmailWorker } from './email.worker';
import { EvaluateWorker } from './evaluate.worker';
import { HlsWorker } from './hls.worker';
import { LikeWorker } from './like.worker';
import { NotificationWorker } from './notification.worker';
import { SurveySyncWorker } from './survey-sync.worker';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurationFactory],
    }),

    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAME.EMAIL_QUEUE },
      { name: QUEUE_NAME.BLOOM_QUEUE },
      { name: QUEUE_NAME.LIKE_QUEUE },
      { name: QUEUE_NAME.NOTIFICATION_QUEUE },
      { name: QUEUE_NAME.EVALUATION_QUEUE },
      { name: QUEUE_NAME.VIDEO_QUEUE },
      { name: QUEUE_NAME.SURVEY_SYNC_QUEUE },
    ),
    DatabaseModule,
    RedisModule,
    CloudflareModule,
  ],
  providers: [
    BloomWorker,
    EmailWorker,
    EvaluateWorker,
    HlsWorker,
    LikeWorker,
    NotificationWorker,
    SurveySyncWorker,
    ReportRepository,
    PostMediaRepository,
    PostRepository,
    LikeRepository,
    LikeService,
  ],
})
export class AppModule { }
