import { Visibility } from '@prisma/client';
import { z } from 'zod';

export const createCircleSchema = z.object({
    name: z.string().min(1, 'Circle name is required').max(100, 'Circle name must be at most 100 characters'),
    visibility: z.nativeEnum(Visibility, {
        errorMap: () => ({ message: `Visibility must be one of: ${Object.values(Visibility).join(', ')}` }),
    }).optional(),
});

export type CreateCircleDto = z.infer<typeof createCircleSchema>;