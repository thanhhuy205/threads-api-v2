/**
 * Internal input after normalizing the external query DTO.
 */
export interface GetTrendingHashtagsInput {
  /**
   * Number of topics to return.
   * The controller currently defaults this to 10.
   */
  limit: number;
}
