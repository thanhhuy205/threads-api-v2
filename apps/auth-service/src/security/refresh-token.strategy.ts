import { BadRequestException } from '@/errors/error';
import type { HttpRequest } from '@/common/types/http.type';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HttpRequest>();
    const refreshToken = request.headers['x-refresh-token'];

    if (typeof refreshToken !== 'string' || !refreshToken.trim()) {
      throw new BadRequestException(
        'Refresh token is required in the x-refresh-token header',
      );
    }

    request.refreshToken = refreshToken;
    return true;
  }
}
