import { getPagination } from "@/shared/pagination/pagination";
import { Request, Response } from "express";
import type { ListReportsQueryDto } from "./dto/request/list-reports.query.dto";
import type { ModerateReportRequestDto } from "./dto/request/moderate-report.request.dto";
import { reportManagementService } from "./report-management.service";

class ReportManagementController {
  listReports = async (
    req: Request<{}, {}, {}, ListReportsQueryDto>,
    res: Response,
  ) => {
    const { currentPage, perPage } = getPagination(req);
    const query = req.query_parsed as ListReportsQueryDto | undefined;
    const result = await reportManagementService.listReports({
      page: currentPage,
      limit: perPage,
      type: query?.type,
    });

    return res.success(200, "Reports retrieved successfully", result.rows, {
      pagination: result.pagination,
    });
  };

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
