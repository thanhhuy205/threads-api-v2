import { QUEUE_NAME, SURVEY_SYNC_JOB_NAME } from "@libs/core/constants/queue";
import { redisKey } from "@libs/core/constants/resolve-key/redis-key";
import { Logger } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import type { PollVoteCountUpdate } from "@api/modules/poll/repository/poll.repository";
import { createWorker } from "@libs/core/providers/bullmq.provider";
import { redisService } from "@libs/core/providers/redis.provider";
import { Prisma } from '@prisma/client';

class SurveySyncWorker {
  private readonly logger = new Logger(SurveySyncWorker.name, { timestamp: true });

  constructor(private readonly prismaService: PrismaService) {}
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

      if (updates.length) {
        const ids = updates.map((update) => update.pollId);
        const cases = Prisma.join(
          updates.map((update) => Prisma.sql`WHEN ${update.pollId} THEN ${update.voteCount}`),
          ' ',
        );
        await this.prismaService.$executeRaw`
          UPDATE polls
          SET vote_count = CASE id ${cases} END
          WHERE id IN (${Prisma.join(ids)})
        `;
      }
      await redisService.sRem(dirtyKey, pollIds);

      this.logger.log(
        `Survey sync processed ${pollIds.length} dirty surveys, updated ${updates.length} polls`,
      );
    } catch (error) {
      this.logger.error(`Error processing survey sync job: ${JSON.stringify(error)}`);
    }
  }
}

export const createSurveySyncWorker = (prismaService: PrismaService) =>
  new SurveySyncWorker(prismaService);
