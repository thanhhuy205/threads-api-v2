import { z } from 'zod';

export const updateProfileSchema = z
    .object({
        name: z.string().trim().max(100, 'Name must be at most 100 characters').optional(),
        bio: z.string().trim().max(500, 'Bio must be at most 500 characters').optional(),
        location: z.string().trim().max(255, 'Location must be at most 255 characters').optional(),
        website: z.string().trim().max(255, 'Website must be at most 255 characters').optional(),
        avatar: z.any().optional(),
    })
    .passthrough();

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;