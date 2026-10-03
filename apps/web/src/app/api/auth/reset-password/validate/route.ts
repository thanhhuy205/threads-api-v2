import { validateTokenSchema } from "@/features/auth/server/schemas";
import { ApiResponse } from "@/lib/http/api-response";
import { forwardAuthRequest } from "../../../_gateway";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";

  const validated = validateTokenSchema.safeParse({ token });
  if (!validated.success) {
    return ApiResponse.validation(validated.error.flatten());
  }

  const encodedToken = encodeURIComponent(validated.data.token);

  return forwardAuthRequest({
    method: "GET",
    path: `/auth/reset-password/validate?token=${encodedToken}`,
  });
}

