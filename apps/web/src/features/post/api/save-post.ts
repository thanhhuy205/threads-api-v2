import type { SavePostResponse } from "@/types/post";
import { http } from "@/utils/http";

export const savePost = async ({ publicId, isSaved }: { publicId: string; isSaved: boolean }) =>
    http.post<SavePostResponse>(`/posts/${publicId}/save`, { isSaved });
