import type { DailyQuestActionValue } from "../constants/daily-quest-action-options";

export interface CreateDailyQuestInput {
  description: string;
  karmaReward: number;
  requirement: number;
  action: DailyQuestActionValue;
  createById: string;
}
