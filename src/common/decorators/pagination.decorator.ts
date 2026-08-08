import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { normalizeOffsetPagination } from '../helpers/offset-pagination.helper';

/** Parses and bounds `page` and `limit` query parameters for offset pagination. */
export const Pagination = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return normalizeOffsetPagination(request.query);
  },
);
