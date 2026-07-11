/**
 * External query string for GET /admin/users.
 */
export type ListUsersQueryDto = {
  /**
   * Raw page from ?page=1.
   */
  page?: string | number;

  /**
   * Raw limit from ?limit=10.
   */
  limit?: string | number;
};
