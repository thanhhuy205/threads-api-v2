import type { Prisma } from '@prisma/client';

export const LIKE_REPOSITORY = Symbol('LIKE_REPOSITORY');

export type LikePayload = { userId: string; postId: string };
export type CreateLikePayload = LikePayload & { isLike: boolean };

export interface LikeRepository {
  createMany(payloads: LikePayload[]): Promise<unknown>;
  create(payload: CreateLikePayload): Promise<unknown>;
  deleteMany(payloads: LikePayload[]): Promise<{ count: number }>;
  updateMany(payloads: LikePayload[]): Promise<{ count: number }>;
  createIfAbsent(payload: LikePayload, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
  deleteByUserAndPost(payload: LikePayload, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
}
