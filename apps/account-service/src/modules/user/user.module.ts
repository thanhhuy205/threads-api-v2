import { Module } from '@nestjs/common';
import { OrganizationController } from './adapters/inbound/http/organization.controller';
import { TeamController } from './adapters/inbound/http/team.controller';
import { UserController } from './adapters/inbound/http/user.controller';
import { KeycloakClientAdapter } from './adapters/outbound/clients/keycloak/keycloak-client.adapter';
import { KeycloakUserAdapter } from './adapters/outbound/clients/keycloak/keycloak-user.adapter';
import { KeyCloakApi } from './adapters/outbound/clients/keycloak/keycloak.client';
import { KEY_CLOAK_CLIENT } from './application/ports/outbound/keycloak.client';
import { KEYCLOAK_USER_ADAPTER } from './application/ports/outbound/keycloak.port';

@Module({
  controllers: [UserController, OrganizationController, TeamController],
  providers: [
    KeyCloakApi,
    {
      provide: KEY_CLOAK_CLIENT,
      useClass: KeycloakClientAdapter,
    },
    {
      provide: KEYCLOAK_USER_ADAPTER,
      useClass: KeycloakUserAdapter,
    },
  ],
  exports: [KeyCloakApi, KEY_CLOAK_CLIENT, KEYCLOAK_USER_ADAPTER],
})
export class UserModule { }
