import { hashtagTrendingRepository } from "./hashtag-trending.repository";

class HashtagTrendingService {
  async listTrendingHashtags() {
    const hashtags = await hashtagTrendingRepository.getTrendingHashtags();

    return {
      hashtags,
      implemented: false,
    };
  }
}

export const hashtagTrendingService = new HashtagTrendingService();
