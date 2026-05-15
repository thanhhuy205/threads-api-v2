import { Request, Response } from "express";
import type { ModerateReportRequestDto } from "./dto/request/moderate-report.request.dto";
import { reportManagementService } from "./report-management.service";

class ReportManagementController {
  moderateReport = async (
    req: Request<{ reportId: string }, {}, ModerateReportRequestDto>,
    res: Response,
  ) => {
    const result = await reportManagementService.moderateReport({
      reportId: req.params.reportId,
      action: req.body?.action,
      adminNote: req.body?.adminNote,
      adminId: req.user?.sub,
    });

    return res.success(200, "Admin report moderation route ready", result);
  };
}

export const reportManagementController = new ReportManagementController();
