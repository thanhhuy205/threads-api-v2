import type { Prisma } from '../../../../generated/prisma';

export const POLL_REPOSITORY = Symbol('POLL_REPOSITORY');

export type CreatePollPayload = {
  postId: number;
  expiresAt: Date;
};

export type PollVoteCountUpdate = {
  pollId: number;
  voteCount: number;
};

export interface PollRepository {
  create(payload: CreatePollPayload, tx?: Prisma.TransactionClient): Promise<any>;
  findByPostId(postId: number, tx?: Prisma.TransactionClient): Promise<any>;
  bulkUpdateVoteCount(
    updates: PollVoteCountUpdate[],
    tx?: Prisma.TransactionClient,
  ): Promise<any>;
}
