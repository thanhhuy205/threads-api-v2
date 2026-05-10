class ReportManagementRepository {
  async moderateReport(_reportId: string, _action: "approve" | "hide_post" | "delete_post") {
    return;
  }
}

export const reportManagementRepository = new ReportManagementRepository();
