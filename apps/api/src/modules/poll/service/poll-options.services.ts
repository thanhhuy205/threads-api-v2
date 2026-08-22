import type { Prisma } from '../../../../generated/prisma';

export const POLL_OPTIONS_SERVICE = Symbol('POLL_OPTIONS_SERVICE');
export type PollOptionInput = string;

export interface PollOptionsService {
  createMany(
    pollId: number,
    options: PollOptionInput[],
    tx: Prisma.TransactionClient,
  ): Promise<any>;
  findByPollId(pollId: number, tx?: Prisma.TransactionClient): Promise<any[]>;
  findByIdAndPollId(id: number, pollId: number, tx?: Prisma.TransactionClient): Promise<any>;
  incrementVotesCount(id: number, pollId: number, tx?: Prisma.TransactionClient): Promise<any>;
}
