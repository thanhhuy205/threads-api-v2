import { GroupType } from "@prisma/client";
import { z } from "zod";

export const createMessageGroupSchema = z.object({
  type: z
    .enum(["private", "crowd"], {
      errorMap: () => ({ message: "type must be private or crowd" }),
    })
    .transform((value) => value.toUpperCase() as GroupType),
  members: z
    .array(z.string().trim().min(1, "username is required"))
    .min(1, "members must contain at least one username"),
});

export type CreateMessageGroupDto = z.infer<typeof createMessageGroupSchema>;
