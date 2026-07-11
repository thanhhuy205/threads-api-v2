import configService from "@/config/config";
import { baseLogger } from "@/middlewares/logger";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

export const leonardoWebhookAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    baseLogger.info(`Authenticating Leonardo webhook with headers: ${JSON.stringify(req.headers)}`);
    const authorizationHeader = req.headers.authorization;
    const receivedAuthorization = Array.isArray(authorizationHeader) ? authorizationHeader[0] : authorizationHeader;
    const receivedWebhookKeyHeader = req.headers["x-leonardo-webhook-api-key"];
    const receivedWebhookKey = Array.isArray(receivedWebhookKeyHeader)
        ? receivedWebhookKeyHeader[0]
        : receivedWebhookKeyHeader;
    const expected = configService.LEONARDO_WEBHOOK_API_KEY;

    const token = receivedAuthorization?.startsWith("Bearer ")
        ? receivedAuthorization.slice("Bearer ".length)
        : receivedWebhookKey ?? "";

    baseLogger.info(`Received Leonardo webhook bearer token: ${token}`);

    if (!token) {
        return res.status(401).json({ error: "Invalid webhook key" });
    }

    baseLogger.info(`Comparing received key with expected key using timingSafeEqual`);

    if (
        token.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
    ) {
        return res.status(401).json({ error: "Invalid webhook key" });
    }

    baseLogger.info(`Leonardo webhook authenticated successfully`);

    next();
};
