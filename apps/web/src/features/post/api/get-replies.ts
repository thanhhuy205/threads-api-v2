import type { ReplyResponse } from "@/types/post";
import { http } from "@/utils/http";

import { buildReplyCursorParams } from "./helpers";

export const getReplies = async ({
    publicId,
    after,
}: {
    publicId: string;
    after?: string;
}) =>
    http.get<ReplyResponse>(
        `/posts/${publicId}/replies?${buildReplyCursorParams(after)}`,
    );
