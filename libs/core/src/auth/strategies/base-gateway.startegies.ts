
import type {
    TokenPayload,
    UserRequestPayload,
} from '@purse/common/interfaces';
import type { HttpRequest } from '@purse/common/types';
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

    async validate(req: HttpRequest): Promise<UserRequestPayload> {
        const authUserHeader = req.headers['x-jwt-claims'];
        if (!authUserHeader) throw new UnauthorizedException('Unauthorized');

        let authUser: TokenPayload;
        try {
            authUser = JSON.parse(
                Array.isArray(authUserHeader) ? authUserHeader[0] : authUserHeader,
            ) as TokenPayload;
        } catch {
            throw new UnauthorizedException('Unauthorized');
        }

        if (!authUser?.id) throw new UnauthorizedException('Unauthorized');

        const authorization = req.headers.authorization;
        if (typeof authorization === 'string') {
            req.accessToken = authorization.split(' ')[1];
        }

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
