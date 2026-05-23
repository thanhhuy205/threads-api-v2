import { buildPaginationResponse } from "@/shared/pagination/pagination";
import type { CreateDailyQuestInput } from "./interfaces/create-daily-quest.input";
import { dailyQuestRepository } from "./daily-quest.repository";
import type { GetAdminDailyQuestsInput } from "./interfaces/get-admin-daily-quests.input";
import type { DisableDailyQuestInput } from "./interfaces/disable-daily-quest.input";

class DailyQuestService {
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
    return dailyQuestRepository.disableDailyQuest(input.id);
  }
}

export const dailyQuestService = new DailyQuestService();
