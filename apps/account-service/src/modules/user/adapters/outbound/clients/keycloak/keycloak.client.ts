import { keycloakApiConfiguration } from '@/config';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class KeycloakClient {
    private axiosCaller: AxiosInstance;
    constructor(
        @Inject(keycloakApiConfiguration.KEY)
        private readonly keycloakApiConfig: ConfigType<typeof keycloakApiConfiguration>,
    ) {
        this.axiosCaller = axios.create({
            baseURL: `${this.keycloakApiConfig.baseUrl}/${this.keycloakApiConfig.realm}/`,
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

    async getOrgMembers(accessToken: string, orgId: string) {
        const response = await this.axiosCaller.get(`organizations/${orgId}/members?first=0&max=20`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }

    async getUserByTeam(accessToken: string, orgId: string, teamId: string) {
        const response = await this.axiosCaller.get(`organizations/${orgId}/groups/${teamId}/members?first=0&max=20`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }

    async getTeamsInOrg(accessToken: string, orgId: string) {
        const response = await this.axiosCaller.get(`organizations/${orgId}/groups?first=0&max=20`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }
}
