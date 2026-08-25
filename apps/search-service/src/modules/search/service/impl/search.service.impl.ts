import { POST_SEARCH_SERVICE, type PostSearchService } from "@post-service/modules/post/service/post-search.service";
import { TOPIC_SERVICE, type TopicService } from "@post-service/modules/topic/service/topic.service";
import { buildCursorPagination } from '@/common/helpers/cursor-pagination.helper';
import { Inject, Injectable } from '@nestjs/common';
import type { SearchService } from '../search.service';

type SerpType = "default";

type SearchPostInput = {
  q: string;
  after?: string;
  take: number;
  serpType?: SerpType;
  userId?: string;
};

@Injectable()
export class SearchServiceImpl implements SearchService {
  constructor(
    @Inject(TOPIC_SERVICE) private readonly topicService: TopicService,
    @Inject(POST_SEARCH_SERVICE) private readonly postSearchService: PostSearchService,
  ) { }

  async searchPost({
    q,
    after,
    take,
    serpType = "default",
    userId,
  }: SearchPostInput) {
    if (serpType !== "default") {
      serpType = "default";
    }

    const posts = await this.postSearchService.searchByContent({
      query: q,
      after,
      take,
      userId,
    });

    return buildCursorPagination({
      rows: posts,
      take,
      getAfter: (item) => item?.publicId,
    });
  }

  async searchTopic({ q }: { q: string }) {
    return this.topicService.searchByName(q);
  }
}

