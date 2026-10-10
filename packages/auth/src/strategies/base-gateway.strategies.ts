import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { UserRequestPayload } from '@purse/common/interfaces';
import type { HttpRequest } from '@purse/common/types';
import type { JWTPayload } from 'jose';
import { Strategy } from 'passport-custom';
import { getPayloadJwtVerify } from '../keycloak';

@Injectable()
export abstract class BaseGatewayAuthStrategy extends PassportStrategy(
  Strategy,
  'gateway-auth',
) {
  async validate(req: HttpRequest): Promise<UserRequestPayload> {
    const authHeader = req.headers.authorization as string;
    if (!authHeader) throw new UnauthorizedException('Unauthorized');

    const accessToken = authHeader.split(' ')[1];
    const authUser = await getPayloadJwtVerify(accessToken);

    if (!authUser.sub) throw new UnauthorizedException('Unauthorized');

    return this.lookupAndValidateUser(authUser);
  }

  protected abstract lookupAndValidateUser(
    authUser: JWTPayload,
  ): Promise<UserRequestPayload>;
}
