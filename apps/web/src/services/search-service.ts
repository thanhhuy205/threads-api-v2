import type { UserSuggestionResponse } from "@/types/user";
import { http } from "@/utils/http";

export const searchApi = {
  getSuggestion: () => http.get<UserSuggestionResponse>("/users/suggestions"),
};
  