import { reportPost } from "@/features/post/api/requests";
import { useMutation } from "@tanstack/react-query";

export const useReportPostMutation = () =>
  useMutation({
    mutationFn: reportPost,
  });
