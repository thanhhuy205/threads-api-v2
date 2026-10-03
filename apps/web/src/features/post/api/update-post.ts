import type { SinglePostResponse, UpdatePostDto } from "@/types/post";
import { http } from "@/utils/http";

export const updatePost = (
    publicId: string,
    payload: UpdatePostDto,
) => http.patch<SinglePostResponse>(`/posts/${publicId}`, payload);
