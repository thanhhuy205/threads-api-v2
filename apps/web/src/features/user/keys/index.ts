import type { UserMentionQueryDto } from "@/types/user";

export const userKeys = {
  all: ["user"] as const,
  profiles: () => [...userKeys.all, "profile"] as const,
  profile: (username: string) => [...userKeys.profiles(), username] as const,

  byUsername: (username: string) =>
    ["user", "get-user-by-username", username] as const,
  mentions: (query?: Pick<UserMentionQueryDto, "q" | "take">) =>
    ["user", "get-user-mentions", query?.q, query?.take].filter(Boolean),
  statusProfile: () => ["user", "me", "status-profile"] as const,
};
