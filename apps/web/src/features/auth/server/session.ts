import "server-only";

import { configService } from "@/config";
import { resolveAppUrl } from "@/lib/http/resolve-app-url";
import type { UserResponse } from "@/types/user";
import { cache } from "react";
import { cookies } from "next/headers";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const hasAccessToken = Boolean(
    cookieStore.get(configService.accessTokenCookieName)?.value,
  );
  const hasRefreshToken = Boolean(
    cookieStore.get(configService.refreshTokenCookieName)?.value,
  );

  if (!hasAccessToken && !hasRefreshToken) {
    return null;
  }

  const cookieHeader = cookieStore.toString();

  try {
    const appUrl = await resolveAppUrl();
    const response = await fetch(`${appUrl}/api/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as UserResponse;
    return data.data ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
});
