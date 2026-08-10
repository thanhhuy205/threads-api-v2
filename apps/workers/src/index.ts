import { redisService } from '@libs/core/providers/redis.provider';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@api/app.module';
import { PrismaService } from '@libs/database';
import { PostRepository } from '@api/modules/post/repository/post.repository';
import { LikeService } from '@api/modules/post/service/like-service.service';
import { ReportRepository } from '@api/modules/report/repository/report.repository';
import { PostMediaRepository } from '@api/modules/upload/repository/post-media.repository';
import { createEvaluateWorker } from './evaluate.worker';
import { createHlsWorker } from './hls.worker';
import { createLikeWorker } from './like.worker';
import { createSurveySyncWorker } from './survey-sync.worker';

const redisReady = redisService.isOpen
    ? Promise.resolve()
    : redisService.connect();


export { bloomWorker } from './bloom.worker';
export { emailWorker } from './email.worker';
export { notificationWorker } from './notification.worker';

async function bootstrapWorkers() {
  await redisReady;
  const app = await NestFactory.createApplicationContext(AppModule);

  createEvaluateWorker(app.get(ReportRepository));
  createHlsWorker(app.get(PostMediaRepository));
  createLikeWorker(app.get(PostRepository), app.get(LikeService));
  createSurveySyncWorker(app.get(PrismaService));
}

void bootstrapWorkers();
