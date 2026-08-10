import { Injectable } from '@nestjs/common';
import { normalizeOffsetPagination } from '@/common/helpers/offset-pagination.helper';
import { Prisma, ReportStatus, ReportTargetType } from "@prisma/client";
import { PrismaService } from '@/shared/database/prisma.service';

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
  adminNote: true,
  assistantNote: true,
} satisfies Prisma.ReportSelect;

const adminReportTargetPostSelect = {
  publicId: true,
  userId: true,
  content: true,
  type: true,
  visibility: true,
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

@Injectable()
export class ReportManagementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ReportUncheckedCreateInput) {
    return this.prisma.report.create({ data });
  }

  async findById(reportId: string) {
    return this.prisma.report.findUnique({
      where: { id: reportId },
      select: {
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
        adminNote: true,
        assistantNote: true,
        targetType: true,
      }
    });
  }

  async updateById(
    reportId: string,
    data: Prisma.ReportUncheckedUpdateInput,
  ) {
    return this.prisma.report.update({
      where: { id: reportId },
      data,
      select: {
        id: true,
        targetId: true,
        targetType: true,
        status: true,
        adminNote: true,
      },
    });
  }

  findAllPaginated({
    page,
    limit,
    targetType,
    status,
  }: {
    page: number;
    limit: number;
    targetType: ReportTargetType;
    status?: ReportStatus;
  }): Promise<AdminReportRow[]> {
    const { offset, limit: currentLimit } = normalizeOffsetPagination({ page, limit });

    return this.prisma.report.findMany({
      where: {
        targetType,
        status,
      },
      skip: offset,
      take: currentLimit,
      orderBy: [{ createdAt: "desc" }],
      select: {
        ...adminReportSelect,
        ...(
          status === ReportStatus.RESOLVED ? {
            adminNote: true,
            status: true,
          } : {}
        )
      },
    });
  }

  countReports({ targetType }: { targetType: ReportTargetType }) {
    return this.prisma.report.count({
      where: {
        targetType,
      },
    });
  }

  findPostsByPublicIds(publicIds: string[]): Promise<AdminReportTargetPost[]> {
    if (!publicIds.length) {
      return Promise.resolve([]);
    }

    return this.prisma.post.findMany({
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

    return this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: adminReportTargetUserSelect,
    });
  }
}
