/**
 * Internal input for the ban-user flow after the controller enriches the DTO.
 * Input files may contain params, JWT metadata, parsed Dates, and defaults.
 */
export interface BanUserInput {
  /**
   * User id from the URL param :userId.
   * Not supplied by the request body.
   */
  userId: string;

  /**
   * Admin id from req.user.sub.
   * Useful later for audit logs and permission-aware service logic.
   */
  adminId?: string;

  /**
   * Parsed Date version of BanUserRequestDto.bannedUntil.
   * undefined means caller did not send it; null can be used later to clear it.
   */
  bannedUntil?: Date | null;

  /**
   * Relative number of hours from the external DTO.
   * Kept here so service logic can choose whether to compute bannedUntil.
   */
  durationHours?: number;
}
