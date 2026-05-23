import { reportRepository } from "@/modules/report/repository/report.repository";
import type { Prisma } from "@prisma/client";

class ReportService {
  async create(data: Prisma.ReportUncheckedCreateInput) {
    return reportRepository.create(data);
  }

  async findById(reportId: string) {
    return reportRepository.findById(reportId);
  }

  async updateById(reportId: string, data: Prisma.ReportUncheckedUpdateInput) {
    return reportRepository.updateById(reportId, data);
  }
}

export const reportService = new ReportService();
