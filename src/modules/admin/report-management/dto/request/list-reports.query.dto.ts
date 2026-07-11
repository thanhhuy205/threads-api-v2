import { ReportStatus } from "@prisma/client";
import { z } from "zod";

export const reportListTypes = ["post", "user", "circle"] as const;

export const listReportsQuerySchema = z.object({
  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional(),
  type: z.enum(reportListTypes).optional().default("post"),
  status: z.enum(["pending", "resolved", "dismissed"]).optional().transform((val) => val?.toUpperCase() as ReportStatus | undefined),
});

export type ReportListType = (typeof reportListTypes)[number];
export type ListReportsQueryDto = z.infer<typeof listReportsQuerySchema>;
