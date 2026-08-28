import { IS_PUBLIC_KEY } from '@libs/common/src/decorators/is-public.decorator';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
export class AppAuthGuard extends AuthGuard('gateway-auth') {
    constructor(private reflector: Reflector) {
        super();
    }

    override async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Allow public routes
        if (isPublic) {
            return true;
        }

        // Only validate token - no authorization logic
        const isGranted = await super.canActivate(context);
        return !!isGranted;
    }
    override handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('Unauthorized');
        }

        return user;
    }
}
