import type { CursorPaginationResponse, PostResponse } from "@/types/post";
import { http } from "@/utils/http";

import { getPaginationParams } from "./helpers";

export const getRepliesMe = async (params?: CursorPaginationResponse | void) =>
    http.get<PostResponse>("/posts/me/replies", {
        params: getPaginationParams(params),
    });
