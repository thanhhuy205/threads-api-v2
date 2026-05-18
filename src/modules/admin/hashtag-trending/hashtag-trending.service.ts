import type { GetTrendingHashtagsInput } from "./interfaces/get-trending-hashtags.input";
import { hashtagTrendingRepository } from "./hashtag-trending.repository";
import { buildPaginationResponse } from "@/shared/pagination/pagination";

class HashtagTrendingService {
  async listTrendingHashtags(input: GetTrendingHashtagsInput) {
    const [hashtags, totalHashtags] = await Promise.all([
      hashtagTrendingRepository.getTrendingHashtags(input),
      hashtagTrendingRepository.countTrendingHashtags(),
    ]);

    return {
      rows: hashtags,
      pagination: buildPaginationResponse(totalHashtags, input.page, input.limit),
    };
  }
}

export const hashtagTrendingService = new HashtagTrendingService();
