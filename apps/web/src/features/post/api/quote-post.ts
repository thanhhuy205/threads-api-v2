import type { CreatePostResponse, QuotePostArgs } from "@/types/post";
import { http } from "@/utils/http";

export const quotePost = async ({ publicId, ...payload }: QuotePostArgs) =>
    http.post<CreatePostResponse>(`/posts/${publicId}/quote`, payload);
