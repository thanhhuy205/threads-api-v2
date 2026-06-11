import { z } from "zod";

/**
 * Actions that an external admin request may ask for.
 * The service maps each action to the report and target updates.
 */
export const reportModerationActions = [
  "approve",
  "hide_post",
  "delete_post",
  "mark_disinformation",
] as const;

/**
 * External request body for PATCH /admin/reports/:reportId.
 */
export const moderateReportRequestSchema = z.object({
  /**
   * Requested moderation action from the admin UI/API client.
   */
  action: z.enum(reportModerationActions),

  /**
   * Human note from admin explaining the decision.
   * Stored in reports.admin_note.
   */
  adminNote: z.string().max(1000).optional(),
});

/**
 * Union type for every supported report moderation action.
 */
export type ReportModerationAction = (typeof reportModerationActions)[number];

/**
 * TypeScript shape inferred from the external request schema.
 */
export type ModerateReportRequestDto = z.infer<typeof moderateReportRequestSchema>;
