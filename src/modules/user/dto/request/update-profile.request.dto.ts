import { z } from "zod";

export const profileLinkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  url: z
    .string()
    .trim()
    .url("Url must be a valid URL")
    .max(255, "Url must be at most 255 characters"),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().max(100, "Name must be at most 100 characters").nullable().optional(),
    bio: z.string().trim().max(500, "Bio must be at most 500 characters").nullable().optional(),
    links: z.array(profileLinkSchema).max(10, "Links must be at most 10 items").nullable().optional(),
    isPrivate: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field is required",
  });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
