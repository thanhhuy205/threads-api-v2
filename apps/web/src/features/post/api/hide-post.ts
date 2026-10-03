import type { MessageResponse } from "@/types/api";
import { http } from "@/utils/http";

export const hidePost = async ({ publicId, isHidden }: { publicId: string; isHidden: boolean }) =>
    http.post<MessageResponse>(`/posts/${publicId}/hide`, { isHidden });
