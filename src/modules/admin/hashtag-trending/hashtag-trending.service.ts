import type { GetTrendingHashtagsInput } from "./interfaces/get-trending-hashtags.input";
import { hashtagTrendingRepository } from "./hashtag-trending.repository";

class HashtagTrendingService {
  async listTrendingHashtags(input: GetTrendingHashtagsInput) {
    const hashtags = await hashtagTrendingRepository.getTrendingHashtags(input);

    return {
      hashtags,
    };
  }
}

export const hashtagTrendingService = new HashtagTrendingService();
