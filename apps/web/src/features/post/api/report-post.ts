import type { ReportPostArgs, ReportPostResponse } from "@/types/post";
import { http } from "@/utils/http";

export const reportPost = async ({
  publicId,
  reason,
  type,
}: ReportPostArgs) =>
  http.post<ReportPostResponse>(`/posts/${publicId}/report`, {
    reason,
    type,
  });
