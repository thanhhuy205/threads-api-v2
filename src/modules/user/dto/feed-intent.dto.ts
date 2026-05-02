import { z } from 'zod';

const createFeedIntentSchema = z
    .object({
        positiveText: z.string().trim().max(255).optional(),
        negativeText: z.string().trim().max(255).optional(),
    })
    .refine((data) => Boolean(data.positiveText || data.negativeText), {
        message: 'At least one of positiveText or negativeText is required',
        path: ['positiveText'],
    });

export type CreateFeedIntentDto = z.infer<typeof createFeedIntentSchema>;

export { createFeedIntentSchema };
