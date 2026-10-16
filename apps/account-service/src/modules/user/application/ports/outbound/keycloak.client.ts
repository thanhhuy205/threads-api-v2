import type { GetTokenCommand } from '../../commands/keycloak';
import type { GetTokenDto } from '../../dto/keycloak';

export const KEY_CLOAK_CLIENT = Symbol('KEY_CLOAK_CLIENT');

export interface KeycloakClient {
  getToken(payload: GetTokenCommand): Promise<GetTokenDto>;
}
