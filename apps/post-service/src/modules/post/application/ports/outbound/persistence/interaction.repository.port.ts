import type { Prisma } from '../../../../../../generated/prisma/client';
import type { PostInteractionCommand } from '../../../commands/post-interaction.command';

export const POST_INTERACTION_REPOSITORY = Symbol('POST_INTERACTION_REPOSITORY');

export interface PostInteractionRepository {
  create(command: PostInteractionCommand, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
  findByStatus(command: PostInteractionCommand, tx?: Prisma.TransactionClient): Promise<{ id: number } | null>;
  deleteByUserPostAndType(command: PostInteractionCommand, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
}
