import type { mapPost } from "@/features/post/map";

interface InteractionBarProps {
  mode: "auto" | "share" | "comment" | "detail";
}

export type MappedPost = ReturnType<typeof mapPost>;
export type MappedUser = MappedPost["user"];

export type { InteractionBarProps };
