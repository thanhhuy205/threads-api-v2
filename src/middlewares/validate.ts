import { COMMON_MESSAGE } from '@/constants/message';
import { baseLogger } from '@/middlewares/logger';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z, ZodSchema } from 'zod';
export const validate =
    (schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') =>
        async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
            try {
                const dataToValidate = source === 'body' ? req.body : source === 'params' ? req.params : req.query;

                const parsed = await schema.parseAsync(dataToValidate);
                baseLogger.info(`Validation successful for ${source}: %o`, parsed);

                if (source === 'body') req.body = parsed;
                if (source === 'params') req.params = parsed;
                if (source === 'query') req.query_parsed = parsed;
                return next();
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const errors = error.issues.map((i) => ({
                        path: i.path.join('.'),
                        message: i.message
                    }));
                    return res.error(StatusCodes.BAD_REQUEST, COMMON_MESSAGE.VALIDATION_FAILED, errors);
                }
                return next(error);
            }
        };