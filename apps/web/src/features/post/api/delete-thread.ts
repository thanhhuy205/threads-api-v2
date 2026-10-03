import type { DeletePostResponse } from "@/types/post";
import { http } from "@/utils/http";

export const deleteThread = async (publicId: string) =>
    http.del<DeletePostResponse>(`/posts/${publicId}`);
