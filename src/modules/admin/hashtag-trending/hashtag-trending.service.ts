import type { GetTrendingHashtagsInput } from "./interfaces/get-trending-hashtags.input";
import { buildOffsetPaginationResponse } from '@/common/helpers/offset-pagination.helper';
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
      pagination: buildOffsetPaginationResponse(totalHashtags, input.page, input.limit),
    };
  }
}
