import { ReportStatus } from "@prisma/client";
import type { ReportListType } from "../dto/request/list-reports.query.dto";

export interface ListReportsInput {
  page: number;
  limit: number;
  type?: ReportListType;
  status?: ReportStatus;
}
