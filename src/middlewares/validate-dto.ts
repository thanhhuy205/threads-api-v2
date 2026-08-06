import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { COMMON_MESSAGE } from '@/constants/message';

const flattenErrors = (errors: Awaited<ReturnType<typeof validate>>, parentPath = ''): Array<{ path: string; message: string }> =>
  errors.flatMap((error) => {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;
    const current = Object.values(error.constraints ?? {}).map((message) => ({ path, message }));
    return [...current, ...flattenErrors(error.children ?? [], path)];
  });

export const validateDto = <T extends object>(dto: ClassConstructor<T>) =>
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const value = plainToInstance(dto, request.body);
    const errors = await validate(value, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      response.error(400, COMMON_MESSAGE.VALIDATION_FAILED, flattenErrors(errors));
      return;
    }

    request.body = value;
    next();
  };
