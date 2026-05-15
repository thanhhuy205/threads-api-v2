/**
 * External query string for GET /admin/stats.
 */
export type AdminStatsQueryDto = {
  /**
   * Raw ISO-ish start date from ?startDate=YYYY-MM-DD or date-time string.
   */
  startDate?: string;

  /**
   * Raw ISO-ish end date from ?endDate=YYYY-MM-DD or date-time string.
   */
  endDate?: string;
};
