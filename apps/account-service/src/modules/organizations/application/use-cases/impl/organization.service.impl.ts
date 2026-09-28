import { Inject, Injectable } from '@nestjs/common';
import type { CreateOrganizationCommand } from '../../commands';
import {
  KEYCLOAK_ORGANIZATION,
  type KeycloakOrganization,
} from '../../port/outbound/keycloak-organization.port';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../port/outbound/organization.repository.port';
import type { CreatedOrganization } from '../../result';
import type { OrganizationUseCase } from '../../port/inbound/organization.use-case';

@Injectable()
export class OrganizationServiceImpl implements OrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
    @Inject(KEYCLOAK_ORGANIZATION)
    private readonly keycloakOrganization: KeycloakOrganization,
  ) {}

  findAll() {
    return this.organizationRepository.findAll();
  }

  async create(command: CreateOrganizationCommand): Promise<CreatedOrganization> {
    const keycloakOrganization = await this.keycloakOrganization.createOrganization(command.name);
    const organization = await this.organizationRepository.create(command);

    return { ...organization, keycloakOrganization };
  }
}
