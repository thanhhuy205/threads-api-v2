import prisma from "@/config/prisma";
import { Injectable } from '@nestjs/common';
import type { Prisma } from "@prisma/client";
import { ReportTargetType } from '@prisma/client';
import { PrismaService } from '@/shared/database/prisma.service';

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService = prisma as PrismaService) {}

  async create(data: Prisma.ReportUncheckedCreateInput) {
    return prisma.report.create({ data });
  }

  async findById(reportId: string) {
    return prisma.report.findUnique({
      where: { id: reportId },
    });
  }

  async updateById(reportId: string, data: Prisma.ReportUncheckedUpdateInput) {
    return prisma.report.update({
      where: { id: reportId },
      data,
    });
  }

  async findExistingReport(params: {
    reporterId: string;
    targetType: ReportTargetType;
    targetId: string;
  }) {
    return prisma.report.findFirst({
      where: {
        reporterId: params.reporterId,
        targetType: params.targetType,
        targetId: params.targetId,
      },
    });
  }
}

export const reportRepository = new ReportRepository();
