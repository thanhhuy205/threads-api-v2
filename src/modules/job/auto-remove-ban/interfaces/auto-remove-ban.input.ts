/**
 * Internal worker input built from BullMQ metadata and job payload.
 */
export interface AutoRemoveBanInput {
  /**
   * Current runtime timestamp used to compare with users.banned_until.
   */
  now: Date;

  /**
   * Normalized trigger source for logs/reporting.
   */
  triggeredBy: string;

  /**
   * BullMQ job id, useful for log correlation.
   */
  jobId?: string;
}
