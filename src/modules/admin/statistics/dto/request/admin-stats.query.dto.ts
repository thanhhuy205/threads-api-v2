import { z } from "zod";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const dateQuerySchema = z
  .string()
  .trim()
  .regex(DATE_PATTERN, "Date must use YYYY-MM-DD format")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }, "Invalid date");

export const adminStatsQuerySchema = z
  .object({
    startDate: dateQuerySchema.optional(),
    endDate: dateQuerySchema.optional(),
  })
  .superRefine((value, context) => {
    if (Boolean(value.startDate) !== Boolean(value.endDate)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: value.startDate ? ["endDate"] : ["startDate"],
        message: "Start date and end date must be provided together",
      });
      return;
    }

    if (
      value.startDate &&
      value.endDate &&
      value.startDate > value.endDate
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be greater than or equal to start date",
      });
    }
  });

export type AdminStatsQueryDto = z.infer<typeof adminStatsQuerySchema>;
