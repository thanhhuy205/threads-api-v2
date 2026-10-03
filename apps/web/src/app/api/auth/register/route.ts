import { registerSchema } from "@/features/auth/server/schemas";
import { forwardAuthRequest, validateBody } from "../../_gateway";

export async function POST(request: Request) {
  const validated = await validateBody(request, registerSchema);
  if (!validated.ok) return validated.response;

  return forwardAuthRequest({
    method: "POST",
    path: "/auth/register",
    body: validated.data,
    syncAuthCookies: true,
    redactAuthPayload: true,
  });
}
