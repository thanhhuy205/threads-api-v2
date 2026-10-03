import type { PostResponse } from "@/types/post";
import { http } from "@/utils/http";

import { buildCursorParams } from "./helpers";

export const getReposts = async ({
    username,
    after,
}: {
    username: string;
    after?: string;
}) =>
    http.get<PostResponse>(`/posts/${username}/repost?${buildCursorParams(after)}`);
