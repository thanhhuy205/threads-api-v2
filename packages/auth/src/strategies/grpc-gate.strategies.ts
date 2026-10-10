import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRequestPayload } from '@purse/common/interfaces';
import type { JWTPayload } from 'jose';
import { BaseGatewayAuthStrategy } from './base-gateway.strategies';

@Injectable()
export class GrpcGatewayAuthStrategy extends BaseGatewayAuthStrategy {
  protected async lookupAndValidateUser(
    authUser: JWTPayload,
  ): Promise<UserRequestPayload> {
    const email = authUser.email;

    if (!authUser.sub || typeof email !== 'string' || !authUser.jti) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      id: authUser.sub,
      email,
      jti: authUser.jti,
      ...(typeof authUser.scope === 'string' && { scope: authUser.scope }),
      ...(typeof authUser.email_verified === 'boolean' && {
        email_verified: authUser.email_verified,
      }),
      ...(typeof authUser.name === 'string' && { name: authUser.name }),
      ...(typeof authUser.preferred_username === 'string' && {
        preferred_username: authUser.preferred_username,
      }),
      ...(typeof authUser.given_name === 'string' && {
        given_name: authUser.given_name,
      }),
      ...(typeof authUser.family_name === 'string' && {
        family_name: authUser.family_name,
      }),
    };
  }
}
