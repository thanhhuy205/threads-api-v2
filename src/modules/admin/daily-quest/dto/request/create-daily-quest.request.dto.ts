import { z } from "zod";

export const createDailyQuestRequestSchema = z.object({
  code: z.string().trim().min(1).max(191),
  description: z.string().trim().min(1).max(255),
  karmaReward: z.coerce.number().int().positive(),
  requirement: z.coerce.number().int().positive(),
});

export type CreateDailyQuestRequestDto = z.infer<typeof createDailyQuestRequestSchema>;
