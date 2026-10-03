import { validateEmailSchema } from "@/features/auth/server/schemas";
import { forwardAuthRequest, validateBody } from "../../../_gateway";

export async function POST(request: Request) {
  const validated = await validateBody(request, validateEmailSchema);
  if (!validated.ok) return validated.response;

  return forwardAuthRequest({
    method: "POST",
    path: "/auth/validate/email",
    body: validated.data,
  });
}

