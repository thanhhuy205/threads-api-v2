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