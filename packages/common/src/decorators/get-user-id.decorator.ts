import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AUTH_MESSAGE } from '../constants/message';
import { UnauthorizedException } from '../errors/error';
import type { HttpRequest } from '../types/http.type';

export const GetUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<HttpRequest>();
    console.log('request.user:', request.user);
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }

    return userId;
  },
);
