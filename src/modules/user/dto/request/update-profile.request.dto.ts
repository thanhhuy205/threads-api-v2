import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().trim().max(100, "Name must be at most 100 characters").nullable().optional(),
    bio: z.string().trim().max(500, "Bio must be at most 500 characters").nullable().optional(),
    labelWebsite: z
      .string()
      .trim()
      .max(100, "Label website must be at most 100 characters")
      .nullable()
      .optional(),
    website: z
      .string()
      .trim()
      .url("Website must be a valid URL")
      .max(255, "Website must be at most 255 characters")
      .nullable()
      .optional(),
    isPrivate: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field is required",
  });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
