import { buildPaginationResponse } from "@/shared/pagination/pagination";
import { dailyQuestActionOptions } from "./constants/daily-quest-action-options";
import { dailyQuestRepository } from "./daily-quest.repository";
import type { CreateDailyQuestInput } from "./interfaces/create-daily-quest.input";
import type { DisableDailyQuestInput } from "./interfaces/disable-daily-quest.input";
import type { GetAdminDailyQuestsInput } from "./interfaces/get-admin-daily-quests.input";

class DailyQuestService {
  getDailyQuestActions() {
    return dailyQuestActionOptions;
  }
  
  async staticsDailyQuestActions() {
   
 }


  async createDailyQuest(input: CreateDailyQuestInput) {
    return dailyQuestRepository.createDailyQuest(input);
  }

  async getDailyQuests(input: GetAdminDailyQuestsInput) {
    const [dailyQuests, totalDailyQuests] = await Promise.all([
      dailyQuestRepository.getActiveDailyQuests(input),
      dailyQuestRepository.countActiveDailyQuests(),
    ]);

    return {
      rows: dailyQuests,
      pagination: buildPaginationResponse(totalDailyQuests, input.page, input.limit),
    };
  }

  async disableDailyQuest(input: DisableDailyQuestInput) {
    return dailyQuestRepository.disableDailyQuest(input.code);
  }
}
export const dailyQuestService = new DailyQuestService();
