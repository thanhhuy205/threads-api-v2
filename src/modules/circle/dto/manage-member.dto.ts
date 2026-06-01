import z from "zod";

export const kickCircleMemberSchema = z.object({
  userId: z.string({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a string",
  }).trim().min(1),
});

export const banCircleMemberSchema = kickCircleMemberSchema.extend({
  reason: z.string().trim().min(1).max(255).optional(),
  expiresAt: z.string().datetime().optional(),
});

export type KickCircleMemberDto = z.infer<typeof kickCircleMemberSchema>;
export type BanCircleMemberDto = z.infer<typeof banCircleMemberSchema>;
