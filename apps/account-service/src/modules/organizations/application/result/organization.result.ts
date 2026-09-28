import type { KeycloakOrganization, Organization } from '../../domain';

export type CreatedOrganization = Organization & {
  keycloakOrganization: KeycloakOrganization;
};
