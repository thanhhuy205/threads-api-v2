import type { ValidateTokenBody } from "@/types/auth";
import { http } from "@/utils/http";
import { configService } from "@/config";

const originHeader = configService.nextPublicBaseUrl;

export const resendVerifyEmail = ({ token }: ValidateTokenBody) =>
  http.post("/auth/resend-verify-email", undefined, {
    headers: {
      "x-origin": originHeader,
      Authorization: `Bearer ${token}`,
    },
  });

export const resendVerifyEmailSession = () =>
  http.post("/api/auth/resend-verify-email");

