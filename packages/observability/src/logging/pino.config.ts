import { randomUUID } from "crypto";
import { Params } from "nestjs-pino";

export function createLoggerOptions(serviceName: string): Params {
    return {
        pinoHttp: {
            level: process.env.LOG_LEVEL ?? 'info',
            customProps: () => ({
                service: serviceName,
                environment:
                    process.env.NODE_ENV ?? 'development',
            }),
            genReqId: (req, res) => {
                const incoming = req.headers["x-request-id"];
                const valid = typeof incoming === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(incoming);
                const requestId = valid ? incoming : randomUUID();
                res.setHeader("X-Request-Id", requestId);
                return requestId;
            },
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:HH:MM:ss',
                    singleLine: false,
                    messageFormat:
                        '{if context}[{context}] {end}{msg}',
                    ignore: [
                        'pid',
                        'hostname',
                        'req.headers',
                        'res.headers',
                        'req.remoteAddress',
                        'req.remotePort',
                    ].join(','),

                    errorLikeObjectKeys: [
                        'err',
                        'error',
                    ],
                },
            },
            redact: {
                paths: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'req.body.password',
                    'req.body.accessToken',
                    'req.body.refreshToken',
                ],
                censor: '[REDACTED]',
            },
        },
    };
}