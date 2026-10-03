import { FeedType, type PostResponse } from "@/types/post";
import { http } from "@/utils/http";

import { buildCursorParams } from "./helpers";

export const getFeedsByFollowing = async ({ after }: { after?: string }) =>
    http.get<PostResponse>(
        `/posts/news-feed?type=${FeedType.FOLLOWING}&${buildCursorParams(after)}`,
    );
