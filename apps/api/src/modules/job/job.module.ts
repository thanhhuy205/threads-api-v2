import { QUEUE_NAME } from '@/constants/queue';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { BloomProducer } from './bloom/producer/bloom.producer';
import { EmailProducer } from './email/producer/email.producer';
import { EvaluationProducer } from './evaluation-post/producer/evaluation.producer';
import { LikeProducer } from './like-job/producer/like.producer';
import { NotificationProducer } from './notification-job/producer/notification.producer';
import { SurveySyncProducer } from './survey-sync/producer/survey-sync.producer';
import { VideoProcedure } from './video/producer/video.procedure';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAME.EMAIL_QUEUE },
      { name: QUEUE_NAME.BLOOM_QUEUE },
      { name: QUEUE_NAME.LIKE_QUEUE },
      { name: QUEUE_NAME.NOTIFICATION_QUEUE },
      { name: QUEUE_NAME.AUTO_REMOVE_BAN_QUEUE },
      { name: QUEUE_NAME.POST_LIKE_EVENT_QUEUE },
      { name: QUEUE_NAME.EVALUATION_QUEUE },
      { name: QUEUE_NAME.FRIEND_REQUEST_QUEUE },
      { name: QUEUE_NAME.HLS_QUEUE },
      {
        name: QUEUE_NAME.VIDEO_QUEUE,
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: false,
        },
      },
      { name: QUEUE_NAME.SURVEY_SYNC_QUEUE },
    ),
  ],
  providers: [
    BloomProducer,
    EmailProducer,
    EvaluationProducer,
    LikeProducer,
    NotificationProducer,
    SurveySyncProducer,
    VideoProcedure,
  ],
  exports: [
    BloomProducer,
    EmailProducer,
    EvaluationProducer,
    LikeProducer,
    NotificationProducer,
    SurveySyncProducer,
    VideoProcedure,
  ],
})
export class JobModule { }
