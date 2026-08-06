import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BadRequestException } from '@/errors/error';

@Injectable()
export class RefreshTokenHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    if (!request.headers['x-refresh-token']) {
      throw new BadRequestException('Refresh token is required in the x-refresh-token header');
    }
    return true;
  }
}
