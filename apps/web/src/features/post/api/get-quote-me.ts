import type { CursorPaginationResponse, PostResponse } from "@/types/post";
import { http } from "@/utils/http";

import { getPaginationParams } from "./helpers";

export const getQuoteMe = async (params?: CursorPaginationResponse | void) =>
    http.get<PostResponse>("/posts/me/quote", {
        params: getPaginationParams(params),
    });
