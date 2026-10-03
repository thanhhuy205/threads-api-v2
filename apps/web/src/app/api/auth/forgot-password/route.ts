import { configService } from "@/config";
import { forgotPasswordSchema } from "@/features/auth/server/schemas";
import { forwardAuthRequest, validateBody } from "../../_gateway";

const fallbackOrigin = configService.nextPublicBaseUrl;

export async function POST(request: Request) {
  const validated = await validateBody(request, forgotPasswordSchema);
  if (!validated.ok) return validated.response;

  return forwardAuthRequest({
    method: "POST",
    path: "/auth/forgot-password",
    body: validated.data,
    headers: {
      "x-origin": request.headers.get("origin") ?? fallbackOrigin,
    },
  });
}

