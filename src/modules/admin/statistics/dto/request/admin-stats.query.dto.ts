import { z } from "zod";

const dateQuerySchema = z.string().trim().refine(
  (value) => !Number.isNaN(Date.parse(value)),
  "Invalid date",
);

export const adminStatsQuerySchema = z
  .object({
    startDate: dateQuerySchema.optional(),
    endDate: dateQuerySchema.optional(),
  })
  .superRefine((value, context) => {
    if (
      value.startDate &&
      value.endDate &&
      Date.parse(value.startDate) > Date.parse(value.endDate)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be greater than or equal to start date",
      });
    }
  });

export type AdminStatsQueryDto = z.infer<typeof adminStatsQuerySchema>;
