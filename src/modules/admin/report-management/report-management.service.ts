import type { ModerateReportInput } from "./interfaces/moderate-report.input";
import { reportManagementRepository } from "./report-management.repository";

class ReportManagementService {
  async moderateReport(input: ModerateReportInput) {
    const report = await reportManagementRepository.findById(input.reportId);

    return {
      ...input,
      report,
      nextStep:
        "TODO: code moderation orchestration here, then call repository DB methods and add any follow-up jobs at the end of the flow.",
    };
  }
}

export const reportManagementService = new ReportManagementService();
