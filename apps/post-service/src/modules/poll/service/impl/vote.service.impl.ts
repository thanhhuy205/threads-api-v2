import { redisKey } from '@purse/common/constants';
import { ConflictException } from '@purse/common/errors';
import { RedisService } from '@purse/redis';
import { Inject, Injectable } from '@nestjs/common';
import { TransactionService } from '../../../../transaction/transaction.service';
import { VOTE_REPOSITORY, type VoteRepository } from "../../repository/vote.repository";
import { POLL_SERVICE, type PollService } from "../poll.service";
import type { VoteService } from '../vote.service';

type CreateVotePayload = {
  pollId: number;
  pollOptionId: number;
  userId: string;
};

@Injectable()
export class VoteServiceImpl implements VoteService {
  private readonly voteLockTtlSeconds = 5;

  constructor(
    @Inject(VOTE_REPOSITORY) private readonly voteRepository: VoteRepository,
    @Inject(POLL_SERVICE) private readonly pollService: PollService,
    private readonly transactionService: TransactionService,
    private readonly redisService: RedisService,
  ) { }

  async createVote(payload: CreateVotePayload) {
    const lockKey = redisKey.poll.voteLock(payload.userId, payload.pollOptionId);
    const countVoteKey = redisKey.poll.countVote(payload.pollId);
    await this.redisService.redis.sAdd(redisKey.poll.dirtySurveys(), String(payload.pollId));
    const locked = await this.redisService.redis.set(lockKey, "1", {
      NX: true,
      EX: this.voteLockTtlSeconds,
    });

    if (!locked) {
      throw new ConflictException("Vote is being processed");
    }

    const result = await this.transactionService.doInTransaction(async (tx) => {
      await this.pollService.assertPollOptionBelongsToPoll(
        payload.pollOptionId,
        payload.pollId,
        tx,
      );

      await this.voteRepository.create(
        {
          userId: payload.userId,
          pollId: payload.pollId,
          pollOptionId: payload.pollOptionId,
        },
        tx,
      );

      const result = await this.pollService.incrementPollOptionVotesCount(
        payload.pollOptionId,
        payload.pollId,
        tx,
      );

      return result;
    });
    let votesCount = 0;
    const exists = await this.redisService.redis.exists(countVoteKey);
    if (!exists) {
      const totalVotes = await this.pollService.getCountVoted(payload.pollId);
      votesCount = totalVotes.count;
      await this.redisService.redis.set(countVoteKey, String(votesCount), {
        EX: 24 * 60 * 60, // 24 hours

      });
    } else {
      votesCount = await this.redisService.redis.incr(countVoteKey);
    }
    await this.redisService.redis.del(lockKey);

    return {
      totalVotes: votesCount,
      votedCount: result.votesCount,
      totalVotedCount: result.votesCount,
      isVoted: true,
    };
  }
}

