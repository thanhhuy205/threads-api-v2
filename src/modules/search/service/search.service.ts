import { postService } from "@/modules/post/service/post.service";
import { topicService } from "@/modules/topic/service/topic.service";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";

type SerpType = "default";

type SearchPostInput = {
  q: string;
  after?: string;
  take: number;
  serpType?: SerpType;
  userId?: string;
};

class SearchService {
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

    const posts = await postService.searchByContent({
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
    return topicService.searchByName(q);
  }
}

export const searchService = new SearchService();
