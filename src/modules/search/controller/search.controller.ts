import { searchService } from "@/modules/search/service/search.service";
import type { Request, Response } from "express";

class SearchController {
  async search(req: Request, res: Response) {
    const { q, type } = req.query;
    const result = await searchService.searchAll(q as string, type as string);
    return res.success(200, "Search results", result);
  }

  async searchUsers(req: Request, res: Response) {
    const { q } = req.query;
    const result = await searchService.searchUsers(q as string);
    return res.success(200, "User search results", result);
  }
}
export const searchController = new SearchController();
