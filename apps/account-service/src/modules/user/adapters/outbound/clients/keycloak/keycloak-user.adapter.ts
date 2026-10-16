import { Inject, Injectable } from "@nestjs/common";
import type { KeycloakUserAdapter as KeycloakUserPort } from "../../../../application/ports/outbound/keycloak.port";
import type {
  GetOrgMembersCommand,
  GetOrgsCommand,
  GetTeamInOrgCommand,
  GetUserByTeamCommand,
} from '../../../../application/commands/keycloak';
import type {
  KeycloakUserDto,
  OrgDto,
  TeamDto,
} from '../../../../application/dto/keycloak';
import { KeyCloakApi } from './keycloak.client';

@Injectable()
export class KeycloakUserAdapter implements KeycloakUserPort {
  constructor(
    @Inject(KeyCloakApi)
    private readonly keyCloakApi: KeyCloakApi,
  ) { }

  async getOrgs(payload: GetOrgsCommand): Promise<OrgDto[]> {
    const organizations = await this.keyCloakApi.getOrgs(payload);
    return organizations.map((organization) => ({
      id: organization.id ?? '',
      name: organization.name ?? '',
      alias: organization.alias ?? '',
      enabled: organization.enabled ?? false,
      description: organization.description ?? '',
      redirectUrl: organization.redirectUrl ?? '',
      domains: (organization.domains ?? []).map((domain) => ({
        name: domain.name ?? '',
        verified: domain.verified ?? false,
      })),
    }));
  }

  async getTeamsInOrg(
    orgId: string,
    payload: GetTeamInOrgCommand,
  ): Promise<TeamDto[]> {
    const teams = await this.keyCloakApi.getTeamsInOrg(orgId, payload);
    return teams.map((team) => ({
      id: team.id ?? '',
      name: team.name ?? '',
    }));
  }

  async getUserByTeam(
    orgId: string,
    teamId: string,
    payload: GetUserByTeamCommand,
  ): Promise<KeycloakUserDto[]> {
    const users = await this.keyCloakApi.getUserByTeam(orgId, teamId, payload);
    return users.map((user) => this.toUserDto(user));
  }

  async getOrgMembers(
    orgId: string,
    payload: GetOrgMembersCommand,
  ): Promise<KeycloakUserDto[]> {
    const users = await this.keyCloakApi.getOrgMembers(orgId, payload);
    return users.map((user) => this.toUserDto(user));
  }

  private toUserDto(user: {
    id?: string;
    username?: string;
    firstName?: string;
    email?: string;
    enabled?: boolean;
    emailVerified?: boolean;
  }): KeycloakUserDto {
    return {
      id: user.id ?? '',
      username: user.username ?? '',
      firstName: user.firstName ?? '',
      email: user.email ?? '',
      enabled: user.enabled ?? false,
      emailVerified: user.emailVerified ?? false,
    };
  }

}
