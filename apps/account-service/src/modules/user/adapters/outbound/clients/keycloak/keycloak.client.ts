import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { keycloakApiConfiguration } from '../../../../../../config';
import type {
    GetOrgMembersDTO,
    GetOrgsDTO,
    GetTeamInOrgDTO,
    GetUserByTeamDTO,
} from './dto/request';

@Injectable()
export class KeycloakClient {
    private axiosCaller: AxiosInstance;
    constructor(
        @Inject(keycloakApiConfiguration.KEY)
        private readonly keycloakApiConfig: ConfigType<typeof keycloakApiConfiguration>,
    ) {
        this.axiosCaller = axios.create({
            baseURL: `${this.keycloakApiConfig.baseUrl}/admin/realms/${this.keycloakApiConfig.realm}/`,
        });

    }

    async createTokenRealms() {
        const { baseUrl, realm, clientId, clientSecretKey } =
            this.keycloakApiConfig;

        const body = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecretKey,
            grant_type: 'client_credentials',
        });

        const response = await axios.post(
            `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
            body.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        return response.data;
    }

    async getOrgMembers(accessToken: string, orgId: string, payload: GetOrgMembersDTO) {
        const response = await this.axiosCaller.get(`organizations/${orgId}/members`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: payload,
        });
        return response.data;
    }

    async getOrgs(accessToken: string, payload: GetOrgsDTO) {
        const response = await this.axiosCaller.get('organizations', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: payload,
        });
        return response.data;
    }

    async getUserByTeam(accessToken: string, orgId: string, teamId: string, payload: GetUserByTeamDTO) {
        const response = await this.axiosCaller.get(`organizations/${orgId}/groups/${teamId}/members`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: payload,
        });
        return response.data;
    }

    async getTeamsInOrg(accessToken: string, orgId: string, payload: GetTeamInOrgDTO) {
        const response = await this.axiosCaller.get(`organizations/${orgId}/groups`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: payload,
        });
        return response.data;
    }
}
