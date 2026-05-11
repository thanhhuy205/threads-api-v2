import { Request, Response } from "express";
import { statisticsService } from "./statistics.service";

class StatisticsController {
  getOverview = async (_req: Request, res: Response) => {
    const result = await statisticsService.getOverview();

    return res.success(200, "Admin statistics route ready", result);
  };
}

export const statisticsController = new StatisticsController();
