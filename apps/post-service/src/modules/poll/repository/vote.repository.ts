import type { Prisma } from '../../../../generated/prisma';

export const VOTE_REPOSITORY = Symbol('VOTE_REPOSITORY');

export type CreateVotePayload = {
  userId: string;
  pollId: number;
  pollOptionId: number;
};

export interface VoteRepository {
  create(payload: CreateVotePayload, tx?: Prisma.TransactionClient): Promise<any>;
  countByPollId(pollId: number, tx?: Prisma.TransactionClient): Promise<number>;
}
