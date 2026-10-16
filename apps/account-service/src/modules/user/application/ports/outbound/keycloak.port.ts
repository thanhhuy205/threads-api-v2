import type {
  GetOrgMembersCommand,
  GetOrgsCommand,
  GetTeamInOrgCommand,
  GetUserByTeamCommand,
} from '../../commands/keycloak';
import type {
  KeycloakUserDto,
  OrgDto,
  TeamDto,
} from '../../dto/keycloak';

export const KEYCLOAK_USER_ADAPTER = Symbol('KEYCLOAK_USER_ADAPTER');
export interface KeycloakUserAdapter {
  getOrgs(payload: GetOrgsCommand): Promise<OrgDto[]>;
  getTeamsInOrg(orgId: string, payload: GetTeamInOrgCommand): Promise<TeamDto[]>;
  getUserByTeam(
    orgId: string,
    teamId: string,
    payload: GetUserByTeamCommand,
  ): Promise<KeycloakUserDto[]>;
  getOrgMembers(
    orgId: string,
    payload: GetOrgMembersCommand,
  ): Promise<KeycloakUserDto[]>;

}
