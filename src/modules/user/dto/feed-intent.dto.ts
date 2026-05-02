import { USER_INTENT_MESSAGE } from '@/constants/message';
import { z } from 'zod';

const createFeedIntentSchema = z
    .object({
        positiveText: z.string().trim().max(255).optional(),
        negativeText: z.string().trim().max(255).optional(),
    })
    .refine((data) => Boolean(data.positiveText || data.negativeText), {
        message: USER_INTENT_MESSAGE.AT_LEAST_ONE_TEXT_REQUIRED,
        path: ['positiveText'],
    });

export type CreateFeedIntentDto = z.infer<typeof createFeedIntentSchema>;

export { createFeedIntentSchema };
