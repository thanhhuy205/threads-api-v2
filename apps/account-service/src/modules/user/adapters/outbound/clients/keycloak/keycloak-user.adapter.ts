import { Inject, Injectable } from '@nestjs/common';
import type { KeycloakUserAdapter as KeycloakUserPort } from '../../../../application/ports/outbound/keycloak.port';
import { KeycloakClient } from './keycloak.client';

@Injectable()
export class KeycloakUserAdapter implements KeycloakUserPort {
  constructor(
    @Inject(KeycloakClient)
    private readonly keycloakClient: KeycloakClient) { }

  async getTeamsInOrg(orgId: string) {
    const { access_token: accessToken } = await this.keycloakClient.createTokenRealms();
    return this.keycloakClient.getTeamsInOrg(accessToken, orgId);
  }

  async getUserByTeam(orgId: string, teamId: string) {
    const { access_token: accessToken } = await this.keycloakClient.createTokenRealms();
    return this.keycloakClient.getUserByTeam(accessToken, orgId, teamId);
  }

  async getOrgMembers(orgId: string) {
    const { access_token: accessToken } = await this.keycloakClient.createTokenRealms();
    return this.keycloakClient.getOrgMembers(accessToken, orgId);
  }
}
