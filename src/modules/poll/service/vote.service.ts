import { redisKey } from "@/constants/resolve-key/redis-key";
import { ConflictException } from "@/errors/error";
import { redisService } from "@/providers/redis.provider";
import { transactionService } from "@/shared/transaction/transaction.service";
import { voteRepository } from "../repository/vote.repository";
import { pollService } from "./poll.service";

type CreateVotePayload = {
  pollId: number;
  pollOptionId: number;
  userId: string;
};

class VoteService {
  private readonly voteLockTtlSeconds = 5;

  async createVote(payload: CreateVotePayload) {
    const lockKey = redisKey.poll.voteLock(payload.userId, payload.pollOptionId);
    const countVoteKey = redisKey.poll.countVote(payload.pollId);
    await redisService.sAdd(redisKey.poll.dirtySurveys(), String(payload.pollId));
    const locked = await redisService.set(lockKey, "1", {
      NX: true,
      EX: this.voteLockTtlSeconds,
    });

    if (!locked) {
      throw new ConflictException("Vote is being processed");
    }

    const result = await transactionService.doInTransaction(async (tx) => {
      await pollService.assertPollOptionBelongsToPoll(
        payload.pollOptionId,
        payload.pollId,
        tx,
      );

      await voteRepository.create(
        {
          userId: payload.userId,
          pollId: payload.pollId,
          pollOptionId: payload.pollOptionId,
        },
        tx,
      );

      const result = await pollService.incrementPollOptionVotesCount(
        payload.pollOptionId,
        payload.pollId,
        tx,
      );

      return result;
    });
    let votesCount = 0;
    const exists = await redisService.exists(countVoteKey);
    if (!exists) {
      const totalVotes = await pollService.getCountVoted(payload.pollId);
      votesCount = totalVotes.count;
      await redisService.set(countVoteKey, String(votesCount), {
        EX: 24 * 60 * 60, // 24 hours

      });
    } else {
      votesCount = await redisService.incr(countVoteKey);
    }
    await redisService.del(lockKey);

    return {
      totalVotes: votesCount,
      votedCount: result.votesCount,
      totalVotedCount: result.votesCount,
      isVoted: true,
    };
  }
}

export const voteService = new VoteService();
