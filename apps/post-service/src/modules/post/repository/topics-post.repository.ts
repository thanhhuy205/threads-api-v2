import type { Prisma } from '../../../generated/prisma/client';

export const TOPICS_POST_REPOSITORY = Symbol('TOPICS_POST_REPOSITORY');

export type CreateTopicsPostInput = { postId: number; topicName: string };

export interface TopicsPostRepository {
  upsert(payload: CreateTopicsPostInput, tx?: Prisma.TransactionClient): Promise<void>;
  findByPostId(postId: number): Promise<{ topicName: string | null }[]>;
  create(payload: CreateTopicsPostInput, tx?: Prisma.TransactionClient): Promise<unknown>;
  findExistingTopicsAndIncreaseCount(topicNames: string[], tx?: Prisma.TransactionClient): Promise<void>;
  createManyAndConnectOrIncreaseCount(payloads: CreateTopicsPostInput[], tx?: Prisma.TransactionClient): Promise<void>;
}
