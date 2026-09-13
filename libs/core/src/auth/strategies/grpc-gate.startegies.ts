import { JWT_ISSUER, JwtTokenType } from '@purse/common/enums';
import type {
  TokenPayload,
  UserRequestPayload,
} from '@purse/common/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseGatewayAuthStrategy } from './base-gateway.startegies';

@Injectable()
export class GrpcGatewayAuthStrategy extends BaseGatewayAuthStrategy {
  protected async lookupAndValidateUser(
    authUser: TokenPayload,
  ): Promise<UserRequestPayload> {
    if (
      !authUser.id ||
      !authUser.email ||
      !authUser.jti ||
      authUser.type !== JwtTokenType.AccessToken ||
      authUser.key !== JWT_ISSUER
    ) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      id: authUser.id,
      email: authUser.email,
      jti: authUser.jti,
      role: authUser.role,
    };
  }
}
