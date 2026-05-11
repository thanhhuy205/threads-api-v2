import { Request, Response } from "express";
import { reportManagementService } from "./report-management.service";

type ReportModerationAction = "approve" | "hide_post" | "delete_post";

class ReportManagementController {
  moderateReport = async (
    req: Request<{ reportId: string }, {}, { action?: ReportModerationAction }>,
    res: Response,
  ) => {
    const action = req.body?.action as ReportModerationAction;
    const result = await reportManagementService.moderateReport(
      req.params.reportId,
      action,
    );

    return res.success(200, "Admin report moderation route ready", result);
  };
}

export const reportManagementController = new ReportManagementController();
