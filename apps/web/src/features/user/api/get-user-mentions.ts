import type { UserMentionQueryDto, UserMentionResponse } from "@/types/user";
import { http } from "@/utils/http";

export const getUserMentions = (params: UserMentionQueryDto) =>
  http.get<UserMentionResponse>("/users/mention", { params });
