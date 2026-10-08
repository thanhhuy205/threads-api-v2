import type { Prisma } from '../../../../../../generated/prisma/client';
import type { CreateLikeCommand, LikeCommand } from '../../../commands/create-like.command';

export const LIKE_REPOSITORY = Symbol('LIKE_REPOSITORY');

export interface LikeRepository {
  createMany(commands: LikeCommand[]): Promise<unknown>;
  create(command: CreateLikeCommand): Promise<unknown>;
  deleteMany(commands: LikeCommand[]): Promise<{ count: number }>;
  updateMany(commands: LikeCommand[]): Promise<{ count: number }>;
  createIfAbsent(command: LikeCommand, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
  deleteByUserAndPost(command: LikeCommand, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
}
