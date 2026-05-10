import { reportManagementRepository } from "./report-management.repository";

class ReportManagementService {
  async moderateReport(reportId: string, action: "approve" | "hide_post" | "delete_post") {
    await reportManagementRepository.moderateReport(reportId, action);

    return {
      reportId,
      action,
      implemented: false,
    };
  }
}

export const reportManagementService = new ReportManagementService();
