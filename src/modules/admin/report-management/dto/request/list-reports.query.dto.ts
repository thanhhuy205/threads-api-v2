import { z } from "zod";

export const reportListTypes = ["post", "user", "circle"] as const;

export const listReportsQuerySchema = z.object({
  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional(),
  type: z.enum(reportListTypes).optional().default("post"),
});

export type ReportListType = (typeof reportListTypes)[number];
export type ListReportsQueryDto = z.infer<typeof listReportsQuerySchema>;
