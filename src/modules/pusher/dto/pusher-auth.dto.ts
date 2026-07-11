import { z } from "zod";

export const pusherAuthSchema = z.object({
  socket_id: z.string().trim().min(1, "socket_id is required"),
  channel_name: z.string().trim().min(1, "channel_name is required"),
});

export type PusherAuthDto = z.infer<typeof pusherAuthSchema>;
