/**
 * Internal stats input after parsing query date strings into Date objects.
 */
export interface GetAdminStatsInput {
  /**
   * Optional lower bound for post/stat aggregation.
   */
  startDate?: Date;

  /**
   * Optional upper bound for post/stat aggregation.
   */
  endDate?: Date;
}
