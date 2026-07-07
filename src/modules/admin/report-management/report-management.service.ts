import { NotFoundException } from "@/errors/error";
import { postActionService } from "@/modules/post/service/post-action.service";
import { buildPaginationResponse } from "@/shared/pagination/pagination";
import { ReportStatus, ReportTargetType } from "@prisma/client";
import type { ModerateReportDataDto } from "./dto/response/moderate-report.response.dto";
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
        status: input.status,
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
    const row = await this.attachTargets([{ ...report }], report.targetType);

    return row[0];
  }


  async moderateReport(
    input: ModerateReportInput,
  ): Promise<ModerateReportDataDto> {
    const report = await reportManagementRepository.findById(input.reportId);

    if (!report) {
      throw new NotFoundException("Report not found");
    }

    let status: ReportStatus;

    switch (input.action) {
      case "approve":
        status = ReportStatus.DISMISSED;
        break;
      case "hide_post":
        status = ReportStatus.RESOLVED;
        await postActionService.actionAdmin(report.targetId, {
          isHidden: true,
        });
        break;
      case "delete_post":
        status = ReportStatus.RESOLVED;
        await postActionService.actionAdmin(report.targetId, {
          isDeleted: true,
        });
        break;
      case "mark_disinformation":
        status = ReportStatus.RESOLVED;
        await postActionService.actionAdmin(report.targetId, {
          isDisinformation: true,
        });
        break;
    }

    const updatedReport = await reportManagementRepository.updateById(
      input.reportId,
      {
        status,
        adminNote: input.adminNote,
      },
    );

    return {
      report: updatedReport,
      moderation: {
        action: input.action,
        adminId: input.adminId ?? null,
      },
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
      adminNote: report.adminNote,
      assistantNote: report.assistantNote,
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
