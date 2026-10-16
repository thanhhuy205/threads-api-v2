import KcAdminClient from '@keycloak/keycloak-admin-client';
import OrganizationMemberRepresentation from '@keycloak/keycloak-admin-client/lib/defs/organizationMemberRepresentation';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { keycloakApiConfiguration } from '../../../../../../config';
import type {
    GetOrgMembersDTO,
    GetOrgsDTO,
    GetTeamInOrgDTO,
    GetUserByTeamDTO,
} from './dto/request';
@Injectable()
export class KeyCloakApi {
    private keyCloakApi: KcAdminClient;
    private authPromise: Promise<void> | null = null;
    constructor(
        @Inject(keycloakApiConfiguration.KEY)
        private readonly keycloakApiConfig: ConfigType<typeof keycloakApiConfiguration>,
    ) {
        this.keyCloakApi = new KcAdminClient({ baseUrl: this.keycloakApiConfig.baseUrl, realmName: this.keycloakApiConfig.realm });
        // Set the token provider.
        this.keyCloakApi.registerTokenProvider({
            getAccessToken: () => this.getToken(),
        });
    }


    private async getToken(): Promise<string> {
        if (!this.keyCloakApi.accessToken || this.keyCloakApi.isTokenExpired()) {
            if (!this.authPromise) {
                this.authPromise = this.keyCloakApi.auth({
                    grantType: 'client_credentials',
                    clientId: this.keycloakApiConfig.apiClientId,
                    clientSecret: this.keycloakApiConfig.apiClientSecretKey,
                }).finally(() => {
                    this.authPromise = null;
                });
            }
            await this.authPromise
        }
        const token = this.keyCloakApi.accessToken;
        if (!token) {
            throw new Error('Keycloak returned no access token');
        }
        return token;
    }

    async getOrgMembers(orgId: string, payload: GetOrgMembersDTO): Promise<OrganizationMemberRepresentation[]> {
        const response = await this.keyCloakApi.organizations.listMembers({
            first: payload.first,
            max: payload.max,
            orgId: orgId,
        });
        return response;
    }

    async getOrgs(payload: GetOrgsDTO) {
        return this.keyCloakApi.organizations.find({
            first: payload.first,
            max: payload.max,
        });
    }

    async getUserByTeam(orgId: string, teamId: string, payload: GetUserByTeamDTO) {
        return this.keyCloakApi.organizations.groups(orgId).listMembers({
            id: teamId,
            first: payload.first,
            max: payload.max,
        });
    }

    async getTeamsInOrg(orgId: string, payload: GetTeamInOrgDTO) {
        return this.keyCloakApi.organizations.groups(orgId).find({
            first: payload.first,
            max: payload.max,
        });
    }
}
