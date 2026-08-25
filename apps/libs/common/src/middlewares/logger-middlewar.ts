import { Inject, NestMiddleware } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

const REMOVE_HEADER = new Set([
    'x-refresh-token'
])
export class LoggerMiddleware implements NestMiddleware {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }
    use(req: any, res: any, next: () => void) {
        const startTime = Date.now();

        const { id, params, query, headers } = req;
        const method = req.method;
        const url = req.url || req.originUrl || '';
        const remoteAddress = req.ip || req.connection.remoteAddress || '::1';
        const requestHeaders = Object.fromEntries(
            Object.entries(headers ?? {}).map(([key, value]) => REMOVE_HEADER.has(key.toLowerCase()) ? [key, '[REMOVE]'] : [key, value]
            )
        )

        res.on('finish', () => {
            const responseTime = Date.now() - startTime;
            const logData = {
                req: {
                    id,
                    method,
                    url,
                    query,
                    params,
                    headers: requestHeaders,
                    remoteAddress,
                    user: req.user,
                },
                res: {
                    statusCode: res.statusCode,
                },
                responseTime,
            };
            if (res.statusCode >= 500) {
                this.logger.error('Request completed', logData);
            } else if (res.statusCode >= 400) {
                this.logger.warn('Request completed', logData);
            } else {
                this.logger.info('Request completed', logData);
            }
        })
    }
}