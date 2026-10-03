import type { CreatePostResponse, ReplyPostArgs } from "@/types/post";
import { http } from "@/utils/http";

export const replyThread = async ({ publicId, payload }: ReplyPostArgs) =>
    http.post<CreatePostResponse>(`/posts/${publicId}/reply`, payload);
