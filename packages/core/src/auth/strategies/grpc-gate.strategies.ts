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

    if (
      !authUser.sub ||
      typeof email !== 'string' ||
      !authUser.jti
    ) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      id: authUser.sub,
      email,
      jti: authUser.jti,
    };
  }
}
