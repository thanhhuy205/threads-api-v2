import { buildPaginationResponse } from "@/shared/pagination/pagination";
import { ReportTargetType } from "@prisma/client";
import type { ListReportsInput } from "./interfaces/list-reports.input";
import type { ModerateReportInput } from "./interfaces/moderate-report.input";
import {
  reportManagementRepository,
  type AdminReportRow,
  type AdminReportTargetPost,
  type AdminReportTargetUser,
} from "./report-management.repository";

const reportTargetTypeMap = {
  post: ReportTargetType.POST,
  user: ReportTargetType.USER,
  circle: ReportTargetType.CIRCLE,
} as const;

class ReportManagementService {
  async listReports(input: ListReportsInput) {
    const targetType = reportTargetTypeMap[input.type ?? "post"];
    const [reports, totalReports] = await Promise.all([
      reportManagementRepository.findAllPaginated({
        page: input.page,
        limit: input.limit,
        targetType,
      }),
      reportManagementRepository.countReports({ targetType }),
    ]);

    const rows = await this.attachTargets(reports, targetType);

    return {
      rows,
      pagination: buildPaginationResponse(totalReports, input.page, input.limit),
    };
  }

  async getReportDetails(reportId: string) {
    const report = await reportManagementRepository.findById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  }


  async moderateReport(input: ModerateReportInput) {
    const report = await reportManagementRepository.findById(input.reportId);

    return {
      ...input,
      report,
      nextStep:
        "TODO: code moderation orchestration here, then call repository DB methods and add any follow-up jobs at the end of the flow.",
    };
  }

  private async attachTargets(
    reports: AdminReportRow[],
    targetType: ReportTargetType,
  ) {
    const targetIds = [...new Set(reports.map((report) => report.targetId))];

    if (targetType === ReportTargetType.USER) {
      const targetUsers = await reportManagementRepository.findUsersByIds(targetIds);
      const targetUserById = new Map(
        targetUsers.map((targetUser) => [targetUser.id, targetUser]),
      );

      return reports.map((report) => ({
        ...this.mapBaseReport(report),
        targetUser: this.mapTargetUser(targetUserById.get(report.targetId) ?? null),
      }));
    }

    const posts = await reportManagementRepository.findPostsByPublicIds(targetIds);
    const postByPublicId = new Map(
      posts.map((post) => [post.publicId, post]),
    );

    return reports.map((report) => ({
      ...this.mapBaseReport(report),
      post: this.mapTargetPost(postByPublicId.get(report.targetId) ?? null),
    }));
  }



  private mapBaseReport(report: AdminReportRow) {
    return {
      id: report.id,
      reporter: report.reporter,
      reason: report.reason,
      status: report.status,
      confidence: report.confidence?.toNumber() ?? null,
      createdAt: report.createdAt,
    };
  }

  private mapTargetPost(post: AdminReportTargetPost | null) {
    if (!post) {
      return null;
    }

    return {
      publicId: post.publicId,
      userId: post.userId,
      content: post.content,
      type: post.type,
      visibility: post.visibility,
      isDeleted: post.isDeleted,
      isHidden: post.isHidden,
      createdAt: post.createdAt,
    };
  }

  private mapTargetUser(targetUser: AdminReportTargetUser | null) {
    if (!targetUser) {
      return null;
    }

    return targetUser;
  }
}

export const reportManagementService = new ReportManagementService();
