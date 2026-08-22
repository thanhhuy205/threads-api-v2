import { UnauthorizedException } from '@/errors/error';
import { AUTH_MESSAGE } from '@libs/core/constants/message';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { HttpRequest } from '../types/http.type';

export const GetUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<HttpRequest>();
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }

    return userId;
  },
);
