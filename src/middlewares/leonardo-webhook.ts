import configService from "@/config/config";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

export const leonardoWebhookAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const receivedHeader = req.headers["x-leonardo-webhook-api-key"];
    const received = Array.isArray(receivedHeader) ? receivedHeader[0] : receivedHeader;
    const expected = configService.LEONARDO_API_KEY;

    if (!received) {
        return res.status(401).json({ error: "Invalid webhook key" });
    }

    if (
        received.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected))
    ) {
        return res.status(401).json({ error: "Invalid webhook key" });
    }

    next();
};
