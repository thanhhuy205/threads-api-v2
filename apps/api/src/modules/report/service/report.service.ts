import { Injectable } from '@nestjs/common';
import type { Prisma } from "@prisma/client";
import { ReportTargetType } from '@prisma/client';
import { ReportRepository } from '../repository/report.repository';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async create(data: Prisma.ReportUncheckedCreateInput) {
    return this.reportRepository.create(data);
  }

  async findById(reportId: string) {
    return this.reportRepository.findById(reportId);
  }

  async updateById(reportId: string, data: Prisma.ReportUncheckedUpdateInput) {
    return this.reportRepository.updateById(reportId, data);
  }

  async findExistingReport(params: {
    reporterId: string;
    targetType: ReportTargetType;
    targetId: string;
  }) {
    return this.reportRepository.findExistingReport(params);
  }
}
