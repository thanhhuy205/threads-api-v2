import { IS_PUBLIC_KEY } from '@/common/decorators/is-public.decorator';
import type { HttpRequest } from '@/common/types/http.type';
import { AUTH_MESSAGE } from '@/constants/message';
import { UnauthorizedException } from '@/errors/error';
import { JwtService } from '@/modules/jwt/service/jwt.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<HttpRequest>();
    const header = request.headers.authorization;
    if (typeof header !== 'string') {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }

    const token = header.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }

    const decoded = await this.jwtService.verifyToken({ token });
    if (!decoded.sub) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }

    request.user = decoded;
    request.accessToken = token;
    return true;
  }
}
