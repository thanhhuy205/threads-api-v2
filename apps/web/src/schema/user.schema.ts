import { z } from "zod";

export const userIdParamsSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export type UserIdParamsDto = z.infer<typeof userIdParamsSchema>;

export const usernameParamsSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export type UsernameParamsDto = z.infer<typeof usernameParamsSchema>;

export const userNameMentionQuerySchema = z.object({
  q: z.string().trim().min(1, "Username include is required"),
  after: z.string().trim().min(1, "After is required").optional(),
  take: z.coerce
    .number()
    .int("Take must be an integer")
    .positive("Take must be a positive number")
    .max(100, "Take must be at most 100")
    .optional(),
});

export type UserNameMentionQueryDto = z.infer<
  typeof userNameMentionQuerySchema
>;

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .max(100, "Name must be at most 100 characters")
      .nullable()
      .optional(),
    bio: z
      .string()
      .trim()
      .max(500, "Bio must be at most 500 characters")
      .nullable()
      .optional(),
    labelWebsite: z
      .string()
      .trim()
      .max(100, "Title must be at most 100 characters")
      .nullable()
      .optional(),
    website: z
      .string()
      .trim()
      .max(255, "Url must be at most 255 characters")
      .refine(val => !val || z.string().url().safeParse(val).success, {
        message: "Url must be a valid URL",
      })
      .nullable()
      .optional(),
    isPrivate: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field is required",
  });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
