import { z } from "zod";

// Nếu không dùng sẽ bị lỗi USE TLS vì có thể có giá trị là string "true" hoặc "false" từ env

const envBoolean = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalizedValue)) {
      return true;
    }

    if (["false", "0", "no", "off", ""].includes(normalizedValue)) {
      return false;
    }
  }

  return value;
}, z.boolean());

export const pusherConfig = z.object({
  PUSHER_APP_ID: z.string().default("app-id"),
  PUSHER_KEY: z.string().default("app-key"),
  PUSHER_SECRET: z.string().default("app-secret"),
  PUSHER_HOST: z.string().default("localhost"),
  PUSHER_PORT: z.coerce.number().int().default(6001),
  PUSHER_USE_TLS: envBoolean.default(false),
  PUSHER_CLUSTER: z.string().default(""),
});
