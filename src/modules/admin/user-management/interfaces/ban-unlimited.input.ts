/**
 * Internal input for the ban-user flow after the controller enriches the DTO.
 * Input files may contain params, JWT metadata, parsed Dates, and defaults.
 */
export interface BanUserUnlimitedInput {
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
}
