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
    const startAt = query.startDate
      ? this.parseDate(query.startDate)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let endAt: Date;
    if (query.endDate) {
      endAt = this.parseDate(query.endDate);

      if (/^\d{4}-\d{2}-\d{2}$/.test(query.endDate)) {
        endAt.setDate(endAt.getDate() + 1);
      }
    } else if (query.startDate) {
      endAt = now;
    } else {
      endAt = new Date(startAt);
      endAt.setDate(endAt.getDate() + 1);
    }

    return { startAt, endAt };
  }

  private parseDate(value: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    return new Date(value);
  }
}

export const statisticsService = new StatisticsService();
