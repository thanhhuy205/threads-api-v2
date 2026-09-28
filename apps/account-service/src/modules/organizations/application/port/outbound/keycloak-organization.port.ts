import type { KeycloakOrganization as KeycloakOrganizationData } from '../../../domain';

export const KEYCLOAK_ORGANIZATION = Symbol('KEYCLOAK_ORGANIZATION');

export interface KeycloakOrganization {
  createOrganization(name: string): Promise<KeycloakOrganizationData>;
}
