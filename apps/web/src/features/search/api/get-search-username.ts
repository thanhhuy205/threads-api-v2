import type { SearchUsernameQueryDto, SearchUsernameResponse } from "@/types/search";
import { http } from "@/utils/http";

// GET /search/username?q=john
export const getSearchUsername = (params: SearchUsernameQueryDto) =>
  http.get<SearchUsernameResponse>("/search/username", {
    params: {
      q: params.q.trim(),
    },
  });
