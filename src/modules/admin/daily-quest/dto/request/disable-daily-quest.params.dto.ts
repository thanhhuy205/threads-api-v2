import { z } from "zod";

export const disableDailyQuestParamsSchema = z.object({
  id: z.coerce.number().int("Daily quest id must be an integer").positive("Daily quest id must be a positive number"),
});

export type DisableDailyQuestParamsDto = z.infer<typeof disableDailyQuestParamsSchema>;
