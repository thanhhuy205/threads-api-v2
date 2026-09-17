import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { HttpRequest } from '../types/http.type';
import { normalizeOffsetPagination } from '../helpers/offset-pagination.helper';

/** Parses and bounds `page` and `limit` query parameters for offset pagination. */
export const Pagination = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<HttpRequest>();
    return normalizeOffsetPagination(request.query);
  },
);
