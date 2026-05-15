import type { UserStatus } from "@prisma/client";

/**
 * DB update input for the auto-remove-ban worker/repository hook.
 * The worker supplies now; the repository only uses it in a where clause.
 */
export interface UpdateExpiredBannedUsersInput {
  /**
   * Runtime timestamp used to find users whose ban has expired.
   */
  now: Date;

  /**
   * Status to write for expired bans, usually UserStatus.ACTIVE.
   */
  status: UserStatus;

  /**
   * Value written back to users.banned_until.
   * null clears the temporary-ban expiry after activation.
   */
  bannedUntil: Date | null;
}
