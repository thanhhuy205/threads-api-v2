import type { InteractionType } from '@prisma/client';

export type CreateInteractionInput = {
    postId: number;
    userId: string;
    action: InteractionType;
};