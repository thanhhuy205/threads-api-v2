import type { AdminStatsQueryDto } from "./dto/request/admin-stats.query.dto";
import { statisticsRepository } from "./statistics.repository";

class StatisticsService {
  async getOverview(query: AdminStatsQueryDto = {}) {
    const period = this.resolvePeriod(query);
    const overview = await statisticsRepository.getOverview(period);

    return {
      period: {
        startAt: period.startAt,
        endAt: period.endAt,
      },
      ...overview,
    };
  }

  private resolvePeriod(query: AdminStatsQueryDto) {
    const now = new Date();
    const startAt = query.startDate && query.endDate
      ? this.parseDate(query.startDate)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endAt = query.startDate && query.endDate
      ? this.parseDate(query.endDate)
      : new Date(startAt);

    endAt.setDate(endAt.getDate() + 1);

    return { startAt, endAt };
  }

  private parseDate(value: string) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
}

export const statisticsService = new StatisticsService();
