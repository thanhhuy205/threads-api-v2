import { QUEUE_NAME, SURVEY_SYNC, SURVEY_SYNC_JOB_NAME } from "@/constants/queue";
import { baseLogger } from "@/middlewares/logger";
import { createQueue } from "@/providers/bullmq.provider";

class SurveySyncProducer {
  private readonly surveySyncQueue = createQueue(QUEUE_NAME.SURVEY_SYNC_QUEUE);

  constructor() {
    baseLogger.info("SurveySyncProducer initialized");
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
      baseLogger.warn(
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

export const surveySyncProducer = new SurveySyncProducer();
