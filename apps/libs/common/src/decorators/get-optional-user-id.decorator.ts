import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TokenPayload } from '../interfaces/auth.interface';
import type { HttpRequest } from '../types/http.type';

/**
 * Resolves the caller's id on routes that work both signed-in and anonymous.
 *
 * `@IsPublic()` routes short-circuit `AppAuthGuard`, so the auth strategy never
 * runs and `request.user` stays undefined. The identity is still available from
 * the `X-JWT-CLAIMS` header Kong sets — `"{}"` for the anonymous consumer.
 * Returns undefined instead of throwing, unlike `GetUserId`.
 */
export const GetOptionalUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined => {
    const request = context.switchToHttp().getRequest<HttpRequest>();

    if (request.user?.id) {
      return request.user.id;
    }

    const claimsHeader = request.headers['x-jwt-claims'];
    if (!claimsHeader) {
      return undefined;
    }

    try {
      const claims = JSON.parse(
        Array.isArray(claimsHeader) ? claimsHeader[0]! : claimsHeader,
      ) as Partial<TokenPayload>;

      return claims.id ?? undefined;
    } catch {
      return undefined;
    }
  },
);
