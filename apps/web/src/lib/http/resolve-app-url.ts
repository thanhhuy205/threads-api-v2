import "server-only";

import { configService } from "@/config";
import { headers } from "next/headers";

const FALLBACK_APP_URL = configService.nextPublicBaseUrl;

export const resolveAppUrl = async () => {
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost ?? headerStore.get("host");
  const forwardedProto = headerStore.get("x-forwarded-proto");

  if (!host) {
    return FALLBACK_APP_URL;
  }

  const protocol =
    forwardedProto ??
    (host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${host}`;
};
