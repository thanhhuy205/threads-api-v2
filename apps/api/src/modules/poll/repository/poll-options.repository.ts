import type { Prisma } from '../../../../generated/prisma';

export const POLL_OPTIONS_REPOSITORY = Symbol('POLL_OPTIONS_REPOSITORY');

export type CreatePollOptionPayload = {
  pollId: number;
  optionText: string;
};

export interface PollOptionsRepository {
  createMany(payload: CreatePollOptionPayload[], tx?: Prisma.TransactionClient): Promise<any>;
  findByPollId(pollId: number, tx?: Prisma.TransactionClient): Promise<any[]>;
  findByIdAndPollId(id: number, pollId: number, tx?: Prisma.TransactionClient): Promise<any>;
  incrementVotesCount(id: number, pollId: number, tx?: Prisma.TransactionClient): Promise<any>;
}
