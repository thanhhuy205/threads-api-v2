import type { GetAdminStatsInput } from "./interfaces/get-admin-stats.input";
import { statisticsRepository } from "./statistics.repository";

class StatisticsService {
  async getOverview(input: GetAdminStatsInput = {}) {
    return statisticsRepository.getOverview(input);
  }
}

export const statisticsService = new StatisticsService();
