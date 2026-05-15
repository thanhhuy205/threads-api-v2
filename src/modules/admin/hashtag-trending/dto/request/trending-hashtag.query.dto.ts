/**
 * External query string for GET /admin/hashtags/trending.
 */
export type TrendingHashtagQueryDto = {
  /**
   * Raw query value from ?limit=10.
   * Query params arrive as strings, so the controller normalizes it to number.
   */
  limit?: string;
};
