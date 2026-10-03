import { Module } from '@nestjs/common';
import { OrganizationController } from './adapters/inbound/http/organization.controller';
import { TeamController } from './adapters/inbound/http/team.controller';
import { UserController } from './adapters/inbound/http/user.controller';
import { KeycloakUserAdapter } from './adapters/outbound/clients/keycloak/keycloak-user.adapter';
import { KeycloakClient } from './adapters/outbound/clients/keycloak/keycloak.client';

@Module({
  controllers: [UserController, OrganizationController, TeamController],
  providers: [KeycloakClient, KeycloakUserAdapter],
  exports: [KeycloakClient, KeycloakUserAdapter],
})
export class UserModule {}
