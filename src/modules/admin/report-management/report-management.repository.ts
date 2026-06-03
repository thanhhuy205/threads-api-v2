import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/pagination";
import type { Prisma } from "@prisma/client";
import { ReportTargetType } from "@prisma/client";

const adminReportSelect = {
  id: true,
  targetId: true,
  reason: true,
  status: true,
  confidence: true,
  createdAt: true,
  reporter: {
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
      email: true,
    },
  },
} satisfies Prisma.ReportSelect;

const adminReportTargetPostSelect = {
  publicId: true,
  userId: true,
  content: true,
  type: true,
  visibility: true,
  isDeleted: true,
  isHidden: true,
  createdAt: true,
} satisfies Prisma.PostSelect;

const adminReportTargetUserSelect = {
  id: true,
  username: true,
  name: true,
  avatar: true,
  email: true,
  status: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type AdminReportRow = Prisma.ReportGetPayload<{
  select: typeof adminReportSelect;
}>;

export type AdminReportTargetPost = Prisma.PostGetPayload<{
  select: typeof adminReportTargetPostSelect;
}>;

export type AdminReportTargetUser = Prisma.UserGetPayload<{
  select: typeof adminReportTargetUserSelect;
}>;

class ReportManagementRepository {
  async create(data: Prisma.ReportUncheckedCreateInput) {
    return prisma.report.create({ data });
  }

  async findById(reportId: string) {
    return prisma.report.findUnique({
      where: { id: reportId },
    });
  }

  async updateById(
    reportId: string,
    data: Prisma.ReportUncheckedUpdateInput,
  ) {
    return prisma.report.update({
      where: { id: reportId },
      data,
    });
  }

  findAllPaginated({
    page,
    limit,
    targetType,
  }: {
    page: number;
    limit: number;
    targetType: ReportTargetType;
  }): Promise<AdminReportRow[]> {
    const { offset, currentLimit } = buildPagination({ page, limit });

    return prisma.report.findMany({
      where: {
        targetType,
      },
      skip: offset,
      take: currentLimit,
      orderBy: [{ createdAt: "desc" }],
      select: adminReportSelect,
    });
  }

  countReports({ targetType }: { targetType: ReportTargetType }) {
    return prisma.report.count({
      where: {
        targetType,
      },
    });
  }

  findPostsByPublicIds(publicIds: string[]): Promise<AdminReportTargetPost[]> {
    if (!publicIds.length) {
      return Promise.resolve([]);
    }

    return prisma.post.findMany({
      where: {
        publicId: {
          in: publicIds,
        },
      },
      select: adminReportTargetPostSelect,
    });
  }

  findUsersByIds(userIds: string[]): Promise<AdminReportTargetUser[]> {
    if (!userIds.length) {
      return Promise.resolve([]);
    }

    return prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: adminReportTargetUserSelect,
    });
  }
}

export const reportManagementRepository = new ReportManagementRepository();
