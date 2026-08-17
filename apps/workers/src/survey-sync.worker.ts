// import type { PollVoteCountUpdate } from "@api/modules/poll/repository/poll.repository";
// import { RedisService } from "@libs/cache/redis.service";
// import { QUEUE_NAME, SURVEY_SYNC_JOB_NAME } from "@libs/core/constants/queue";
// import { redisKey } from "@libs/core/constants/resolve-key/redis-key";
// import { PrismaService } from '@libs/database';
// import { Processor, WorkerHost } from '@nestjs/bullmq';
// import { Logger } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
// import { Job } from 'bullmq';

// @Processor(QUEUE_NAME.SURVEY_SYNC_QUEUE)
// export class SurveySyncWorker extends WorkerHost {
//   private readonly logger = new Logger(SurveySyncWorker.name, { timestamp: true });

//   constructor(
//     private readonly prismaService: PrismaService,
//     private readonly redisService: RedisService,
//   ) {
//     super();
//   }
//   async process(job: Job<any, any, string>): Promise<any> {
//     switch (job.name) {
//       case SURVEY_SYNC_JOB_NAME.SYNC_VOTE_COUNT:
//         return this.syncVoteCount();
//       default:
//         throw new Error(`Unknown job name: ${job.name}`);
//     }
//   }

//   async syncVoteCount() {
//     try {
//       const dirtyKey = redisKey.poll.dirtySurveys();
//       const pollIds = await this.redisService.redis.sMembers(dirtyKey);

//       if (pollIds.length === 0) {
//         return;
//       }

//       const countKeys = pollIds.map((pollId) =>
//         redisKey.poll.countVote(Number(pollId)),
//       );

//       const counts = await this.redisService.redis.mGet(countKeys);

//       const updates: PollVoteCountUpdate[] = [];
//       pollIds.forEach((pollId, index) => {
//         const raw = counts[index];
//         if (raw === null) {
//           return;
//         }

//         const voteCount = Number(raw);
//         if (!Number.isFinite(voteCount)) {
//           return;
//         }

//         updates.push({ pollId: Number(pollId), voteCount });
//       });

//       if (updates.length) {
//         const ids = updates.map((update) => update.pollId);
//         const cases = Prisma.join(
//           updates.map((update) => Prisma.sql`WHEN ${update.pollId} THEN ${update.voteCount}`),
//           ' ',
//         );
//         await this.prismaService.$executeRaw`
//           UPDATE polls
//           SET vote_count = CASE id ${cases} END
//           WHERE id IN (${Prisma.join(ids)})
//         `;
//       }
//       await this.redisService.redis.sRem(dirtyKey, pollIds);

//       this.logger.log(
//         `Survey sync processed ${pollIds.length} dirty surveys, updated ${updates.length} polls`,
//       );
//     } catch (error) {
//       this.logger.error(`Error processing survey sync job: ${JSON.stringify(error)}`);
//     }
//   }
// }
