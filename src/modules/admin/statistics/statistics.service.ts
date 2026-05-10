import { statisticsRepository } from "./statistics.repository";

class StatisticsService {
  async getOverview() {
    const overview = await statisticsRepository.getOverview();

    return {
      ...overview,
      implemented: false,
    };
  }
}

export const statisticsService = new StatisticsService();
