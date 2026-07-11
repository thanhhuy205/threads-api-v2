import pino from "pino";
import { pinoHttp } from "pino-http";

export const baseLogger = pino({
    transport: process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:standard" } }
        : undefined
});

export const logger = pinoHttp({
    logger: baseLogger,
    serializers: {
        req(req) {
            return {
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
                body: req.body,
            };
        },

        res(res) {
            return {
                statusCode: res.statusCode,
                "x-xss-protection": res.headers?.["x-xss-protection"],
                "access-control-allow-origin": res.headers?.["access-control-allow-origin"],
                "x-ratelimit-limit": res.headers?.["x-ratelimit-limit"],
                "x-ratelimit-remaining": res.headers?.["x-ratelimit-remaining"],
                date: res.headers?.date,
                "x-ratelimit-reset": res.headers?.["x-ratelimit-reset"],
                "content-type": res.headers?.["content-type"],
                "content-length": res.headers?.["content-length"],
            };
        },
    },
});


