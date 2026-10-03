import type { PostByUserQueryDto, PostResponse } from "@/types/post";
import { http } from "@/utils/http";

import { getPaginationParams } from "./helpers";

export const getPostsByUser = async ({ username, ...params }: PostByUserQueryDto) =>
    http.get<PostResponse>(`/posts/user/${username}`, {
        params: getPaginationParams(params),
    });
