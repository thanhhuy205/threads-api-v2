import type { UsernameParamsDto } from "@/schema/user.schema";
import type { UserProfileResponse } from "@/types/user";
import { http } from "@/utils/http";

export const getUserByUsername = (username: UsernameParamsDto["username"]) =>
  http.get<UserProfileResponse>(`/users/${username}`);
