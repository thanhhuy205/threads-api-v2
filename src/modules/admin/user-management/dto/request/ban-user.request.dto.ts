import { z } from "zod";

/**
 * External request body for PATCH /admin/users/:userId/ban.
 * DTO files describe data that comes from outside the app boundary.
 */
export const banUserRequestSchema = z.object({
  /**
   * Number of hours the user remains banned.
   * The service converts this duration into the internal bannedUntil value.
   */
  durationHours: z.coerce.number().int().positive(),
});

/**
 * TypeScript shape inferred from the zod schema above.
 * Controllers should use this for req.body typing.
 */
export type BanUserRequestDto = z.infer<typeof banUserRequestSchema>;
