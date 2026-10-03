import { configService } from "@/config";

const upstreamBaseUrl = configService.backendUrl;

export type RefreshResult = {
  accessToken: string;
  refreshToken?: string;
  sessionId?: string;
} | null;

export async function requestRefreshToken(
  refreshToken: string,
): Promise<RefreshResult> {
  if (!refreshToken.trim()) {
    return null;
  }

  try {
    if (!upstreamBaseUrl) {
      throw new Error("Missing BACKEND_URL configuration.");
    }

    const upstreamUrl = `${upstreamBaseUrl.replace(/\/+$/, "")}/auth/refresh-token`;

    const res = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-refresh-token": refreshToken,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const responseData = data?.data;

    const newAccessToken = responseData?.accessToken;
    const newRefreshToken = responseData?.refreshToken;
    const sessionId = responseData?.sessionId;

    if (!newAccessToken) {
      return null;
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionId,
    };
  } catch {
    return null;
  }
}
