import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { HttpRequest } from '../types/http.type';
import { normalizeCursorPagination } from '../helpers/cursor-pagination.helper';

/** Parses and bounds `after` and `take` query parameters for cursor pagination. */
export const CursorPagination = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<HttpRequest>();
    return normalizeCursorPagination(request.query);
  },
);

// Kept as a compatibility alias for the original requested spelling.
export const CursorPaginaion = CursorPagination;
