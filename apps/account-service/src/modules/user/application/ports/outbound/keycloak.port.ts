import type {
  KeycloakUserResponseDto,
  OrgResponseDto,
  TeamResponseDto,
} from '../../../adapters/outbound/clients/keycloak/dto/response';
import type {
  GetOrgMembersDTO,
  GetOrgsDTO,
  GetTeamInOrgDTO,
  GetUserByTeamDTO,
} from '../../../adapters/outbound/clients/keycloak/dto/request';

export const KEYCLOAK_USER_ADAPTER = Symbol('KEYCLOAK_USER_ADAPTER');
export interface KeycloakUserAdapter {
  getOrgs(payload: GetOrgsDTO): Promise<OrgResponseDto[]>;
  getTeamsInOrg(orgId: string, payload: GetTeamInOrgDTO): Promise<TeamResponseDto[]>;
  getUserByTeam(
    orgId: string,
    teamId: string,
    payload: GetUserByTeamDTO,
  ): Promise<KeycloakUserResponseDto[]>;
  getOrgMembers(
    orgId: string,
    payload: GetOrgMembersDTO,
  ): Promise<KeycloakUserResponseDto[]>;
}
