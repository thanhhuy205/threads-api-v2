/**
 * Internal input after normalizing the external query DTO.
 */
export interface GetTrendingHashtagsInput {
  /**
   * Current page in offset pagination.
   */
  page: number;

  /**
   * Number of topics to return.
   */
  limit: number;
}
