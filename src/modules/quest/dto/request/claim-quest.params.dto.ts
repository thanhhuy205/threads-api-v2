import { z } from 'zod';

export const claimQuestParamsSchema = z.object({
    questId: z.coerce.number().int('Quest id must be an integer').positive('Quest id must be a positive number'),
});

export type ClaimQuestParamsDto = z.infer<typeof claimQuestParamsSchema>;
