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
            transport: process.env.NODE_ENV === 'development' ? {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:HH:MM:ss',
                    singleLine: true,
                    ignore:
                        'pid,hostname,req.headers,res.headers,req.remoteAddress,req.remotePort',
                },
            } : undefined,
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