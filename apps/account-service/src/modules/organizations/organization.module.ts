import { Module } from '@nestjs/common';
import { OrganizationHttpController } from './adapters/inbound/http/organization.http.controller';
import { KeycloakOrganizationClient } from './adapters/outbound/clients/keycloak-organization.client';
import { OrganizationRepositoryImpl } from './adapters/outbound/persistence/organization.repository.impl';
import { ORGANIZATION_USE_CASE } from './application/port/inbound/organization.use-case';
import { KEYCLOAK_ORGANIZATION } from './application/port/outbound/keycloak-organization.port';
import { ORGANIZATION_REPOSITORY } from './application/port/outbound/organization.repository.port';
import { OrganizationServiceImpl } from './application/use-cases/impl/organization.service.impl';

@Module({
  controllers: [OrganizationHttpController],
  providers: [
    { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepositoryImpl },
    { provide: KEYCLOAK_ORGANIZATION, useClass: KeycloakOrganizationClient },
    { provide: ORGANIZATION_USE_CASE, useClass: OrganizationServiceImpl },
  ],
})
export class OrganizationModule {}
