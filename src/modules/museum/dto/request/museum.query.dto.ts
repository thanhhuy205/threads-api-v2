import { z } from 'zod';

export const museumQuerySchema = z.object({
    limit: z.coerce.number().int('Limit must be an integer').positive('Limit must be a positive number').max(100, 'Limit must be at most 100').optional(),
    cursor: z.string().trim().min(1, 'Cursor must not be empty').optional(),
    sort: z.enum(['recent', 'longestLived']).optional(),
});

export type MuseumQueryDto = z.infer<typeof museumQuerySchema>;
