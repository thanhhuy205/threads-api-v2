import { z } from 'zod';

export const claimQuestParamsSchema = z.object({
    code: z.coerce.string().nonempty('Quest code is required'),
});

export type ClaimQuestParamsDto = z.infer<typeof claimQuestParamsSchema>;
