import { Request, Response } from "express";
import { hashtagTrendingService } from "../hashtag-trending/hashtag-trending.service";
import { reportManagementService } from "../report-management/report-management.service";
import { statisticsService } from "../statistics/statistics.service";
import { userManagementService } from "../user-management/user-management.service";

type UserModerationAction = "lock" | "unlock" | "temporary_ban";
type ReportModerationAction = "approve" | "hide_post" | "delete_post";

class AdminController {
  async moderateUser(req: Request<{ userId: string }, {}, { action?: UserModerationAction }>, res: Response) {
    const action = req.body?.action as UserModerationAction;
    const result = await userManagementService.moderateUser(req.params.userId, action);

    return res.success(200, "Admin user moderation route ready", result);
  }

  async moderateReport(req: Request<{ reportId: string }, {}, { action?: ReportModerationAction }>, res: Response) {
    const action = req.body?.action as ReportModerationAction;
    const result = await reportManagementService.moderateReport(req.params.reportId, action);

    return res.success(200, "Admin report moderation route ready", result);
  }

  async listTrendingHashtags(_req: Request, res: Response) {
    const result = await hashtagTrendingService.listTrendingHashtags();

    return res.success(200, "Admin trending hashtags route ready", result);
  }

  async getStatisticsOverview(_req: Request, res: Response) {
    const result = await statisticsService.getOverview();

    return res.success(200, "Admin statistics route ready", result);
  }
}

export const adminController = new AdminController();
