import type { CursorPaginationResponse, PostResponse } from "@/types/post";
import { http } from "@/utils/http";

import { getPaginationParams } from "./helpers";

export const getPostMe = async (params?: CursorPaginationResponse | void) =>
    http.get<PostResponse>("/posts/me", {
        params: getPaginationParams(params),
    });
