import { configService } from "@/config";
import { forwardAuthRequest, getRequestAuthTokens } from "../../_gateway";

export async function POST(request: Request) {
  const { accessToken, refreshToken } = getRequestAuthTokens(request);
  const originHeader = configService.nextPublicBaseUrl;

  return forwardAuthRequest({
    method: "POST",
    path: "/auth/resend-verify-email",
    authorization: accessToken ? `Bearer ${accessToken}` : null,
    refreshToken,
    headers: {
      "x-origin-url": originHeader,
    },
  });
}
