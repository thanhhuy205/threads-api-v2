import { redisKey } from "@/constants/resolve-key/redis-key";
import { ConflictException } from "@/errors/error";
import { redisService } from "@/providers/redis.provider";
import { transactionService } from "@/shared/transaction/transaction.service";
import { voteRepository } from "../repository/vote.repository";
import { pollService } from "./poll.service";

type CreateVotePayload = {
  pollId: number;
  pollOptionsId: number;
  userId: string;
};

class VoteService {
  private readonly voteLockTtlSeconds = 5;

  async createVote(payload: CreateVotePayload) {
    const lockKey = redisKey.poll.voteLock(payload.userId, payload.pollOptionsId);
    const locked = await redisService.set(lockKey, "1", {
      NX: true,
      EX: this.voteLockTtlSeconds,
    });

    if (!locked) {
      throw new ConflictException("Vote is being processed");
    }

    const result = await transactionService.doInTransaction(async (tx) => {
      await pollService.assertPollOptionBelongsToPoll(
        payload.pollOptionsId,
        payload.pollId,
        tx,
      );

      await voteRepository.create(
        {
          userId: payload.userId,
          pollId: payload.pollId,
          pollOptionId: payload.pollOptionsId,
        },
        tx,
      );

      const result = await pollService.incrementPollOptionVotesCount(
        payload.pollOptionsId,
        payload.pollId,
        tx,
      );

      return result;
    });

    redisService.del(lockKey);
    return {
      votedCount: result.votesCount,
      isVoted: true,
    };
  }
}

export const voteService = new VoteService();
