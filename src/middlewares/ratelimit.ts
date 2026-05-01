import configService from "@/config/config";
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: configService.RATE_LIMIT_WINDOW_MS,
    limit: configService.RATE_LIMIT_MAX,
});
