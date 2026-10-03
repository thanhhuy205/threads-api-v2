import type { PostResponse } from "@/types/post";
import { http } from "@/utils/http";

export const searchPosts = async ({ query }: { query: string }) =>
    http.get<PostResponse>("/posts/search", {
        params: { query },
    });
