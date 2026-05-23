import { z } from "zod";

export const disableDailyQuestParamsSchema = z.object({
  code: z.coerce.string().trim().min(1).max(191),
});

export type DisableDailyQuestParamsDto = z.infer<typeof disableDailyQuestParamsSchema>;
