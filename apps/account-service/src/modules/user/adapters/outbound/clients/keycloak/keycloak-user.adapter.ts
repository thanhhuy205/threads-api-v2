import { Inject, Injectable } from "@nestjs/common";
import type { KeycloakUserAdapter as KeycloakUserPort } from "../../../../application/ports/outbound/keycloak.port";
import type {
  GetOrgMembersDTO,
  GetOrgsDTO,
  GetTeamInOrgDTO,
  GetUserByTeamDTO,
} from "./dto/request";
import { KeycloakClient } from "./keycloak.client";

@Injectable()
export class KeycloakUserAdapter implements KeycloakUserPort {
  constructor(
    @Inject(KeycloakClient)
    private readonly keycloakClient: KeycloakClient,
  ) { }

  async getOrgs(payload: GetOrgsDTO) {
    const { access_token: accessToken } =
      await this.keycloakClient.createTokenRealms();
    return this.keycloakClient.getOrgs(accessToken, payload);
  }

  async getTeamsInOrg(orgId: string, payload: GetTeamInOrgDTO) {
    const { access_token: accessToken } =
      await this.keycloakClient.createTokenRealms();
    return this.keycloakClient.getTeamsInOrg(accessToken, orgId, payload);
  }

  async getUserByTeam(
    orgId: string,
    teamId: string,
    payload: GetUserByTeamDTO,
  ) {
    const { access_token: accessToken } =
      await this.keycloakClient.createTokenRealms();
    return this.keycloakClient.getUserByTeam(
      accessToken,
      orgId,
      teamId,
      payload,
    );
  }

  async getOrgMembers(orgId: string, payload: GetOrgMembersDTO) {
    const { access_token: accessToken } =
      await this.keycloakClient.createTokenRealms();
    return this.keycloakClient.getOrgMembers(accessToken, orgId, payload);
  }

}
