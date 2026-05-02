import { z } from 'zod';

export const updateProfileSchema = z
    .object({
        name: z.string().trim().max(100).optional(),
        bio: z.string().trim().max(500).optional(),
        location: z.string().trim().max(255).optional(),
        website: z.string().trim().max(255).optional(),
        avatar: z.any().optional(),
    })
    .passthrough();

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;