import { PostSearchService } from "@/modules/post/service/post-search.service";
import { TopicService } from "@/modules/topic/service/topic.service";
import { buildCursorPagination } from '@/common/helpers/cursor-pagination.helper';
import { Injectable } from '@nestjs/common';

type SerpType = "default";

type SearchPostInput = {
  q: string;
  after?: string;
  take: number;
  serpType?: SerpType;
  userId?: string;
};

@Injectable()
export class SearchService {
  constructor(
    private readonly topicService: TopicService,
    private readonly postSearchService: PostSearchService,
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

