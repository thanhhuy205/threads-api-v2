import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { KeycloakOrganization as KeycloakOrganizationData } from '../../../domain';
import type { KeycloakOrganization } from '../../../application/port/outbound/keycloak-organization.port';

type KeycloakOrganizationResponse = {
  id?: string;
  name?: string;
};

@Injectable()
export class KeycloakOrganizationClient implements KeycloakOrganization {
  constructor(private readonly configService: ConfigService) {}

  async createOrganization(name: string): Promise<KeycloakOrganizationData> {
    const accessToken = await this.getAccessToken();
    const baseUrl = this.configService.get<string>('KEYCLOAK_BASE_URL') ?? 'http://localhost:18081';
    const realm = this.configService.get<string>('KEYCLOAK_REALM') ?? 'pulseboard';
    const response = await fetch(`${baseUrl}/admin/realms/${realm}/organizations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException('Keycloak organization creation failed');
    }

    const payload = await response.json().catch(() => ({})) as KeycloakOrganizationResponse;
    const id = payload.id ?? response.headers.get('location')?.split('/').at(-1);
    if (!id) {
      throw new ServiceUnavailableException('Keycloak did not return an organization identifier');
    }

    return { id, name: payload.name ?? name };
  }

  private async getAccessToken(): Promise<string> {
    const configuredToken = this.configService.get<string>('KEYCLOAK_ADMIN_TOKEN');
    if (configuredToken) {
      return configuredToken;
    }

    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');
    const clientSecret = this.configService.get<string>('KEYCLOAK_CLIENT_SECRET');
    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException('Keycloak admin credentials are not configured');
    }

    const baseUrl = this.configService.get<string>('KEYCLOAK_BASE_URL') ?? 'http://localhost:18081';
    const realm = this.configService.get<string>('KEYCLOAK_REALM') ?? 'pulseboard';
    const response = await fetch(`${baseUrl}/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException('Keycloak token request failed');
    }

    const payload = await response.json() as { access_token?: string };
    if (!payload.access_token) {
      throw new ServiceUnavailableException('Keycloak token response is invalid');
    }

    return payload.access_token;
  }
}
