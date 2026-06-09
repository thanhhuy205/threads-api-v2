import { Request, Response } from "express";
import type { AdminStatsQueryDto } from "./dto/request/admin-stats.query.dto";
import { statisticsService } from "./statistics.service";

class StatisticsController {
  getOverview = async (
    req: Request,
    res: Response,
  ) => {
    const query = req.query_parsed as AdminStatsQueryDto;
    const result = await statisticsService.getOverview(query);

    return res.success(200, "Admin statistics retrieved successfully", result);
  };
}

export const statisticsController = new StatisticsController();
