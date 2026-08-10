import { AUTH_MESSAGE } from '@/constants/message';
import { ForbiddenException, UnauthorizedException } from '@/errors/error';
import { JwtService } from '@/modules/jwt/service/jwt.service';
import { UserService } from '@/modules/user/service/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import type { HttpRequest } from '@/common/types/http.type';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,
    private readonly redisService: any,
    private readonly userService: UserService
  ) { }


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<HttpRequest>();

    const header = request.headers.authorization;
    if (typeof header !== 'string') {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    const token = header.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }

    // const isBlacklisted = await redisService.exists(
    //   redisKey.auth.accessTokenBlacklist(token),
    // );

    // if (isBlacklisted > 0) {
    //   throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    // }

    const decoded = await this.jwtService.verifyToken({ token });

    if (!decoded.sub) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    const user = await this.userService.findByUserId(decoded.sub);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }

    if (user.status === UserStatus.BANNED) {
      throw new ForbiddenException(AUTH_MESSAGE.USER_BANNED);
    }

    request.user = decoded;
    request.accessToken = token;

    return true;
  }
}
