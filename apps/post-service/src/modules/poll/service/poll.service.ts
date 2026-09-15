import type { Prisma } from '../../../generated/prisma/client';
import type { PollVoteCountUpdate } from '../repository/poll.repository';
import type { PollOptionInput } from './poll-options.service';

export const POLL_SERVICE = Symbol('POLL_SERVICE');

export type CreatePostPollPayload = {
  postId: number;
  options: PollOptionInput[];
  expiresAt?: Date;
};

export interface PollService {
  createForPost(payload: CreatePostPollPayload, tx: Prisma.TransactionClient): Promise<any>;
  findByPostId(postId: number, tx?: Prisma.TransactionClient): Promise<any>;
  assertPollOptionBelongsToPoll(
    pollOptionId: number,
    pollId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<any>;
  incrementPollOptionVotesCount(
    pollOptionId: number,
    pollId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<any>;
  getCountVoted(pollId: number, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
  syncVoteCounts(updates: PollVoteCountUpdate[], tx?: Prisma.TransactionClient): Promise<any>;
}
