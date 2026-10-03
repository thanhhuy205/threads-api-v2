import type {
  KeycloakUserResponseDto,
  TeamResponseDto,
} from '../../../adapters/outbound/clients/keycloak/dto/response';

export interface KeycloakUserAdapter {
  getTeamsInOrg(orgId: string): Promise<TeamResponseDto[]>;
  getUserByTeam(orgId: string, teamId: string): Promise<KeycloakUserResponseDto[]>;
  getOrgMembers(orgId: string): Promise<KeycloakUserResponseDto[]>;
}
