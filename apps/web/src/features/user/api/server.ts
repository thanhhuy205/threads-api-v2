import "server-only";

import { serverGetJson } from "@/lib/http/server-api";
import type { UsernameParamsDto } from "@/schema/user.schema";
import type { UserProfileResponse } from "@/types/user";

export const getUserByUsernameServer = (
  username: UsernameParamsDto["username"],
) => {
  const normalizedUsername = username.trim();

  if (!normalizedUsername) return Promise.resolve(null);

  return serverGetJson<UserProfileResponse>(
    `/users/${encodeURIComponent(normalizedUsername)}`,
  );
};
