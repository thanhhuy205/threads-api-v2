import "server-only";

import { serverFetch } from "@/lib/http/server";
import type { MessageResponse } from "@/types/api";

export const verifyEmailToken = async (token: string) => {
  if (!token) {
    return false;
  }

  const response = await serverFetch("/auth/verify-email", {
    auth: false,
    method: "POST",
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    return false;
  }

  try {
    const payload = (await response.json()) as MessageResponse & { success?: boolean };
    return payload.success !== false;
  } catch {
    return false;
  }
};
