import { InteractionType } from '@prisma/client';
import { z } from 'zod';

export const createInteractionSchema = z.object({
    action: z.nativeEnum(InteractionType),
});

export type CreateInteractionDto = z.infer<typeof createInteractionSchema>;