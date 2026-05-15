import { Request, Response } from "express";
import type { AdminStatsQueryDto } from "./dto/request/admin-stats.query.dto";
import { statisticsService } from "./statistics.service";

class StatisticsController {
  getOverview = async (
    req: Request<{}, {}, {}, AdminStatsQueryDto>,
    res: Response,
  ) => {
    const result = await statisticsService.getOverview({
      startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
    });

    return res.success(200, "Admin statistics route ready", result);
  };
}

export const statisticsController = new StatisticsController();
