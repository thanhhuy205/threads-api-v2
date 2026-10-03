import type { RepostPostResponse } from "@/types/post";
import { http } from "@/utils/http";

export const repostPost = async (publicId: string) =>
    http.post<RepostPostResponse>(`/posts/${publicId}/repost`);
