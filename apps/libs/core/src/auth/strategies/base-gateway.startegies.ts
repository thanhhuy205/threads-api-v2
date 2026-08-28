
import type {
    TokenPayload,
    UserRequestPayload,
} from '@libs/common/src/interfaces/auth.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export abstract class BaseGatewayAuthStrategy extends PassportStrategy(
    Strategy,
    'gateway-auth',
) {
    constructor() {
        super();
    }

    async validate(req: Request): Promise<UserRequestPayload> {
        const { headers } = req;
        const authUserHeader = headers.get('x-jwt-claims') as string;
        if (!authUserHeader) throw new UnauthorizedException('Unauthorized');
        const authUser: TokenPayload = JSON.parse(authUserHeader);
        if (!authUser?.id) throw new UnauthorizedException('Unauthorized');

        // // Check valid token in Redis
        // const userTokenKey = this.redisService.getUserTokenKey(authUser.id, authUser.jti);
        // const isTokenValid = await this.redisService.getValue<string>(userTokenKey);
        // if (!isTokenValid) throw new UnauthorizedException('Unauthorized');

        return this.lookupAndValidateUser(authUser);
    }

    protected abstract lookupAndValidateUser(
        authUser: TokenPayload,
    ): Promise<UserRequestPayload>;
}
