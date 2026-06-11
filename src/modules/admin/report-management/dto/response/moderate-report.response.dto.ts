import type { BaseResponse } from "@/shared/interface/base-response.interface";
import type { ReportStatus, ReportTargetType } from "@prisma/client";
import type { ReportModerationAction } from "../request/moderate-report.request.dto";

export interface ModeratedReportDto {
  id: string;
  targetId: string;
  targetType: ReportTargetType;
  status: ReportStatus;
  adminNote: string | null;
}

export interface ModerateReportDataDto {
  report: ModeratedReportDto;
  moderation: {
    action: ReportModerationAction;
    adminId: string | null;
  };
}

export type ModerateReportResponseDto = BaseResponse<ModerateReportDataDto>;
