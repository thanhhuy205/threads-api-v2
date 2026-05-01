import env from "@/config/env";
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
});
