import { Visibility } from '@prisma/client';
import { z } from 'zod';

export const createCircleSchema = z.object({
    name: z.string(),
    visibility: z.nativeEnum(Visibility).optional(),
});

export type CreateCircleDto = z.infer<typeof createCircleSchema>;