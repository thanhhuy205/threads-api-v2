import { z } from "zod";

export const userIdParamsSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export const friendRequestParamsSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export type UserIdParamsDto = z.infer<typeof userIdParamsSchema>;
export type FriendRequestParamsDto = z.infer<typeof friendRequestParamsSchema>;
