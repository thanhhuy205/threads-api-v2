import type { Request, Response } from "express";
import { searchService } from "@/modules/search/service/search.service";

class SearchController {
  async search(req: Request, res: Response) {
    const { q, type } = req.query;
    const result = await searchService.searchAll(q as string, type as string);
    return res.success(200, "Search results", result);
  }
}

export const searchController = new SearchController();
