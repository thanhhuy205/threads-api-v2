import { forwardAuthRequest, getRequestAuthTokens } from "../../_gateway";

export async function GET(request: Request) {
  const { accessToken, refreshToken } = getRequestAuthTokens(request);

  return forwardAuthRequest({
    method: "GET",
    path: "/auth/me",
    authorization: accessToken ? `Bearer ${accessToken}` : null,
    refreshToken,
  });
}
