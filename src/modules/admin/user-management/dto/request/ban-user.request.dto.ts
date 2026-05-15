import { z } from "zod";

/**
 * External request body for PATCH /admin/users/:userId/ban.
 * DTO files describe data that comes from outside the app boundary.
 */
export const banUserRequestSchema = z.object({
  /**
   * Absolute expiry time for a temporary ban.
   * Example: "2026-05-20T10:30:00.000Z".
   * Null/omitted means the current frame treats the ban as open-ended until
   * service logic decides otherwise.
   */
  bannedUntil: z.string().datetime().optional(),

  /**
   * Relative ban length requested by the caller.
   * This is captured for flexibility, but the service must later convert it
   * into bannedUntil before writing final business behavior.
   */
  durationHours: z.coerce.number().int().positive().optional(),
});

/**
 * TypeScript shape inferred from the zod schema above.
 * Controllers should use this for req.body typing.
 */
export type BanUserRequestDto = z.infer<typeof banUserRequestSchema>;
