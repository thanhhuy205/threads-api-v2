import type { GetTrendingHashtagsInput } from "./interfaces/get-trending-hashtags.input";
import { buildPaginationResponse } from "@/shared/pagination/pagination";
import { Injectable } from '@nestjs/common';
import { HashtagTrendingRepository } from "./hashtag-trending.repository";

@Injectable()
export class HashtagTrendingService {
  constructor(private readonly hashtagTrendingRepository: HashtagTrendingRepository) {}

  async listTrendingHashtags(input: GetTrendingHashtagsInput) {
    const [hashtags, totalHashtags] = await Promise.all([
      this.hashtagTrendingRepository.getTrendingHashtags(input),
      this.hashtagTrendingRepository.countTrendingHashtags(),
    ]);

    return {
      rows: hashtags,
      pagination: buildPaginationResponse(totalHashtags, input.page, input.limit),
    };
  }
}
