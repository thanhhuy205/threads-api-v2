import type {
  SearchPostsQueryDto,
  SearchTopicQueryDto,
  SearchUsernameQueryDto,
} from "@/modules/search/dto/search.dto";
import { searchService } from "@/modules/search/service/search.service";
import { userService } from "@/modules/user/service/user.service";
import type { Request, Response } from "express";

class SearchController {
  async searchPost(req: Request<{}, {}, {}, {}>, res: Response) {
    const { q, after, take, serp_type } = req.query_parsed as SearchPostsQueryDto;
    const { rows, pagination } = await searchService.searchPost({
      q,
      after,
      take,
      serpType: serp_type,
      userId: req.user?.sub,
    });
    return res.paginate({
      rows,
      pagination,
    });
  }

  async searchUsername(req: Request<{}, {}, {}, {}>, res: Response) {
    const { q } = req.query_parsed as SearchUsernameQueryDto;
    if (q.length === 1) {
      const result = await userService.searchUsernameOneQuery({ query: q });
      return res.success(200, "Usernames retrieved successfully", result);
    }
    const result = await userService.searchUsername({ query: q });
    return res.success(200, "Usernames retrieved successfully", result);
  }

  async searchTopic(req: Request<{}, {}, {}, {}>, res: Response) {
    const { q } = req.query_parsed as SearchTopicQueryDto;
    const result = await searchService.searchTopic({ q });
    return res.success(200, "Topics retrieved successfully", result);
  }
}
export const searchController = new SearchController();
