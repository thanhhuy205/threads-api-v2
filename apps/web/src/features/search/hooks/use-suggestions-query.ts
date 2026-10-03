import { searchKeys } from "@/features/search/keys";
import { searchApi } from "@/services/search-service";
import type { UserSuggestionResponse } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useSearchStore } from "../store";

export const useSuggestionsQuery = (enabled = true) => {
  const setItems = useSearchStore((state) => state.setItems);

  return useQuery({
    queryKey: searchKeys.suggestions,
    queryFn: async (): Promise<UserSuggestionResponse> => {
      const response = await searchApi.getSuggestion();
      setItems(response.data);
      return response;
    },
    enabled,
  });
};
