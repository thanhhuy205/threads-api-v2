import type { InteractionType, Prisma } from '../../../../../generated/prisma/client';

export const POST_INTERACTION_REPOSITORY = Symbol('POST_INTERACTION_REPOSITORY');

export type PostInteractionPayload = {
  userId: string;
  postId: number;
  type: InteractionType;
};

export interface PostInteractionRepository {
  create(payload: PostInteractionPayload, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
  findByStatus(payload: PostInteractionPayload, tx?: Prisma.TransactionClient): Promise<{ id: number } | null>;
  deleteByUserPostAndType(payload: PostInteractionPayload, tx?: Prisma.TransactionClient): Promise<{ count: number }>;
}
