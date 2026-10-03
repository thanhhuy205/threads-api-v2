import { FeedType, type FeedType as FeedTypeValue, type PostResponse } from "@/types/post";
import { http } from "@/utils/http";

import { buildCursorParams } from "./helpers";

export const getFeeds = async ({
    after,
    type = FeedType.FOR_YOU,
}: {
    after?: string;
    type?: FeedTypeValue;
}) =>
    http.get<PostResponse>(
        `/posts/news-feed?type=${type}&${buildCursorParams(after)}`,
    );
