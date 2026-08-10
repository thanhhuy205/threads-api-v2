import { Injectable } from '@nestjs/common';
import type { Prisma } from "@prisma/client";
import { ReportTargetType } from '@prisma/client';
import { PrismaService } from '@/shared/database/prisma.service';

@Injectable()
export class ReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ReportUncheckedCreateInput) {
    return this.prismaService.report.create({ data });
  }

  async findById(reportId: string) {
    return this.prismaService.report.findUnique({
      where: { id: reportId },
    });
  }

  async updateById(reportId: string, data: Prisma.ReportUncheckedUpdateInput) {
    return this.prismaService.report.update({
      where: { id: reportId },
      data,
    });
  }

  async findExistingReport(params: {
    reporterId: string;
    targetType: ReportTargetType;
    targetId: string;
  }) {
    return this.prismaService.report.findFirst({
      where: {
        reporterId: params.reporterId,
        targetType: params.targetType,
        targetId: params.targetId,
      },
    });
  }
}
