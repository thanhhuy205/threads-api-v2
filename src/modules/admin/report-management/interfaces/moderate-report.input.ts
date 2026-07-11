import type { ReportModerationAction } from "../dto/request/moderate-report.request.dto";

/**
 * Internal input after controller combines URL params, JWT user, and body DTO.
 */
export interface ModerateReportInput {
  /**
   * Report id from the route param :reportId.
   */
  reportId: string;

  /**
   * Requested action from the external DTO.
   */
  action: ReportModerationAction;

  /**
   * Admin user id from req.user.sub.
   * This is internal context for future audit logs.
   */
  adminId?: string;

  /**
   * Optional note from the request body, carried into service orchestration.
   */
  adminNote?: string;
}
