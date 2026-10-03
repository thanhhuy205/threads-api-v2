import type { UserSuggestion } from "@/types/user";
import { create } from "zustand";

type SearchStore = {
  items: UserSuggestion[];
  setItems: (items: UserSuggestion[]) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
