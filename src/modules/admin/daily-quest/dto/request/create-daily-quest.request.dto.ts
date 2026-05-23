import { z } from "zod";
import { dailyQuestActionValues } from "../../constants/daily-quest-action-options";

export const createDailyQuestRequestSchema = z.object({
  code: z.string().trim().min(1).max(191),
  description: z.string().trim().min(1).max(255),
  karmaReward: z.coerce.number().positive(),
  requirement: z.coerce.number().int().positive(),
  action: z.enum(dailyQuestActionValues),
});

export type CreateDailyQuestRequestDto = z.infer<typeof createDailyQuestRequestSchema>;
