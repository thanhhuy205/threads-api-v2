import { ForbiddenException, UnauthorizedException } from '@/errors/error';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoleType } from "apps/auth-service/generated/prisma";

type AuthenticatedRequest = {
  user?: {
    roles: UserRoleType[];
  };
};

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new UnauthorizedException('User not found');
    }
    if (!request.user.roles.includes(UserRoleType.ADMIN)) {
      throw new ForbiddenException('Role not found');
    }
    return true;
  }
}
