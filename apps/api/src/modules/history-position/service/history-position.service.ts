export const HISTORY_POSITION_SERVICE = Symbol('HISTORY_POSITION_SERVICE');

export type CreateHistoryPositionInput = {
  userId: string;
  title: string;
  detail?: string;
  skillIds: number[];
};

export interface HistoryPositionService {
  create(
    payload: CreateHistoryPositionInput,
  ): Promise<FullHistoryPosition | null>;
  findManyByUserId(userId: string): Promise<FullHistoryPosition[]>;
}
import type { FullHistoryPosition } from '../repository/history-position.repository';
