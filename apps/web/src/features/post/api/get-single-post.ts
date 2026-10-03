import type { SinglePostResponse } from "@/types/post";
import { http } from "@/utils/http";

export const getSinglePost = async (publicId: string) =>
    http.get<SinglePostResponse>(`/posts/${publicId}`);
