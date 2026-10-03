import { forwardAuthRequest, getRequestAuthTokens } from "../../_gateway";

export async function POST(request: Request) {
    const { refreshToken } = getRequestAuthTokens(request);

    return forwardAuthRequest({
        method: "POST",
        path: "/auth/refresh-token",
        refreshToken,
    });
}
