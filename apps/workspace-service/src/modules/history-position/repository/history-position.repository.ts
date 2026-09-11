import type { Prisma } from 'apps/workspace-service/generated/prisma';

export const HISTORY_POSITION_REPOSITORY = Symbol(
  'HISTORY_POSITION_REPOSITORY',
);

export type CreateHistoryPositionPayload = {
  userId: string;
  title: string;
  details?: string;
  timeStart: Date;
};

export type FullHistoryPosition = Prisma.HistoryPositionGetPayload<{
  include: {
    historyPositionSkills: {
      include: { skill: true };
    };
  };
}>;

export interface HistoryPositionRepository {
  create(
    payload: CreateHistoryPositionPayload,
    tx?: Prisma.TransactionClient,
  ): Promise<{ id: number }>;
  findByIdAndUserId(
    id: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<FullHistoryPosition | null>;
  findManyByUserId(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<FullHistoryPosition[]>;
}
