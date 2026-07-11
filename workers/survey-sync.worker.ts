import { QUEUE_NAME, SURVEY_SYNC_JOB_NAME } from "../src/constants/queue";
import { redisKey } from "../src/constants/resolve-key/redis-key";
import { baseLogger } from "../src/middlewares/logger";
import type { PollVoteCountUpdate } from "../src/modules/poll/repository/poll.repository";
import { pollService } from "../src/modules/poll/service/poll.service";
import { createWorker } from "../src/providers/bullmq.provider";
import { redisService } from "../src/providers/redis.provider";

class SurveySyncWorker {
  private readonly worker = createWorker(
    QUEUE_NAME.SURVEY_SYNC_QUEUE,
    async (job) => {
      switch (job.name) {
        case SURVEY_SYNC_JOB_NAME.SYNC_VOTE_COUNT:
          return this.syncVoteCount();
        default:
          throw new Error(`Unknown job name: ${job.name}`);
      }
    },
  );

  async syncVoteCount() {
    try {
      const dirtyKey = redisKey.poll.dirtySurveys();
      const pollIds = await redisService.sMembers(dirtyKey);

      if (pollIds.length === 0) {
        return;
      }

      const countKeys = pollIds.map((pollId) =>
        redisKey.poll.countVote(Number(pollId)),
      );

      const counts = await redisService.mGet(countKeys);

      const updates: PollVoteCountUpdate[] = [];
      pollIds.forEach((pollId, index) => {
        const raw = counts[index];
        if (raw === null) {
          return;
        }

        const voteCount = Number(raw);
        if (!Number.isFinite(voteCount)) {
          return;
        }

        updates.push({ pollId: Number(pollId), voteCount });
      });

      await pollService.syncVoteCounts(updates);
      await redisService.sRem(dirtyKey, pollIds);

      baseLogger.info(
        `Survey sync processed ${pollIds.length} dirty surveys, updated ${updates.length} polls`,
      );
    } catch (error) {
      baseLogger.error(`Error processing survey sync job: ${JSON.stringify(error)}`);
    }
  }
}

export const surveySyncWorker = new SurveySyncWorker();
