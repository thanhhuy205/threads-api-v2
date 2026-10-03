import type { PostByUserQueryDto, PostResponse } from "@/types/post";
import { http } from "@/utils/http";

import { getPaginationParams } from "./helpers";

export const getQuotesByUser = async ({ username, ...params }: PostByUserQueryDto) =>
    http.get<PostResponse>(`/posts/user/${username}/quotes`, {
        params: getPaginationParams(params),
    });

export const getQuote = getQuotesByUser;
