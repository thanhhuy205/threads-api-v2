import z from "zod";

export const friendRequestIdParamsSchema = z.object({
  id: z.coerce.number(),
});

export type FriendRequestIdParamsDto = z.infer<
  typeof friendRequestIdParamsSchema
>;

export const friendRequestSchema = z.object({
  isAccept: z.boolean(),
});
export type FriendRequestDto = z.infer<typeof friendRequestSchema>;
