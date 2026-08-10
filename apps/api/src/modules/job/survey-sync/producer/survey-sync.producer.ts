import { QUEUE_NAME, SURVEY_SYNC, SURVEY_SYNC_JOB_NAME } from "@/constants/queue";
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class SurveySyncProducer {
  private readonly logger = new Logger(SurveySyncProducer.name, { timestamp: true });
  constructor(@InjectQueue(QUEUE_NAME.SURVEY_SYNC_QUEUE) private readonly surveySyncQueue: Queue) {
    this.logger.log("SurveySyncProducer initialized");
  }

  async initSyncSurveyJob() {
    const repeatableJobs = await this.surveySyncQueue.getRepeatableJobs();
    const surveySyncJobs = repeatableJobs.filter(
      (job) => job.name === SURVEY_SYNC_JOB_NAME.SYNC_VOTE_COUNT,
    );

    if (surveySyncJobs.length > 0) {
      await Promise.all(
        surveySyncJobs.map((job) =>
          this.surveySyncQueue.removeRepeatableByKey(job.key),
        ),
      );
      this.logger.warn(
        `Removed ${surveySyncJobs.length} existing survey sync repeat jobs before re-initializing scheduler`,
      );
    }

    await this.surveySyncQueue.add(
      SURVEY_SYNC_JOB_NAME.SYNC_VOTE_COUNT,
      {},
      {
        jobId: SURVEY_SYNC_JOB_NAME.SYNC_VOTE_COUNT,
        repeat: { every: SURVEY_SYNC.INTERVAL_MS },
        attempts: 1,
      },
    );
  }

  get queue() {
    return this.surveySyncQueue;
  }
}
