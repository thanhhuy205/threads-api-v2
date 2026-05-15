import { z } from "zod";

/**
 * Actions that an external admin request may ask for.
 * The repository does not decide these actions; service logic will interpret
 * them later and call DB methods in the right order.
 */
export const reportModerationActions = [
  "approve",
  "hide_post",
  "delete_post",
] as const;

/**
 * External request body for PATCH /admin/reports/:reportId.
 */
export const moderateReportRequestSchema = z.object({
  /**
   * Requested moderation action from the admin UI/API client.
   * Optional for now because this endpoint is still a frame.
   */
  action: z.enum(reportModerationActions).optional(),

  /**
   * Human note from admin explaining the decision.
   * Stored later in reports.admin_note when service logic is finalized.
   */
  adminNote: z.string().max(1000).optional(),
});

/**
 * Union type: "approve" | "hide_post" | "delete_post".
 */
export type ReportModerationAction = (typeof reportModerationActions)[number];

/**
 * TypeScript shape inferred from the external request schema.
 */
export type ModerateReportRequestDto = z.infer<typeof moderateReportRequestSchema>;
