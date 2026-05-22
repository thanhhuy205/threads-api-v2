import type {
  SearchPostsQueryDto,
  SearchTopicQueryDto,
  SearchUsernameQueryDto,
} from "@/modules/search/dto/search.dto";
import { searchService } from "@/modules/search/service/search.service";
import type { Request, Response } from "express";

class SearchController {
  async searchPost(req: Request<{}, {}, {}, SearchPostsQueryDto>, res: Response) {
    const { q, after, take, serp_type } = req.query_parsed as SearchPostsQueryDto;
    const { rows, pagination } = await searchService.searchPost({
      q,
      after,
      take,
      serpType: serp_type,
    });
    return res.paginate({
      rows,
      pagination,
    });
  }

  async searchUsername(req: Request<{}, {}, {}, SearchUsernameQueryDto>, res: Response) {
    const { q, after, take } = req.query_parsed as SearchUsernameQueryDto;
    const { rows, pagination } = await searchService.searchUsername({ q, after, take });
    return res.paginate({
      rows,
      pagination,
    });
  }

  async searchTopic(req: Request<{}, {}, {}, SearchTopicQueryDto>, res: Response) {
    const { q, after, take } = req.query_parsed as SearchTopicQueryDto;
    const { rows, pagination } = await searchService.searchTopic({ q, after, take });
    return res.paginate({
      rows,
      pagination,
    });
  }
}
export const searchController = new SearchController();
