import { forwardAuthRequest, getRequestAuthTokens } from "../../_gateway";

export async function POST(request: Request) {
  const { accessToken, refreshToken } = getRequestAuthTokens(request);

  return forwardAuthRequest({
    method: "POST",
    path: "/auth/logout",
    authorization: accessToken ? `Bearer ${accessToken}` : null,
    refreshToken,
    clearAuthCookies: true,
  });
}
