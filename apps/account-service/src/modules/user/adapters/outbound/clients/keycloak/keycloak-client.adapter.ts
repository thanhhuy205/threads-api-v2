import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import axios from 'axios';
import { keycloakApiConfiguration } from '../../../../../../config';
import type { GetTokenCommand } from '../../../../application/commands/keycloak';
import type { GetTokenDto } from '../../../../application/dto/keycloak';
import type { KeycloakClient } from '../../../../application/ports/outbound/keycloak.client';

@Injectable()
export class KeycloakClientAdapter implements KeycloakClient {
  constructor(
    @Inject(keycloakApiConfiguration.KEY)
    private readonly keycloakApiConfig: ConfigType<typeof keycloakApiConfiguration>,
  ) { }

  async getToken({ code, redirectUrl }: GetTokenCommand): Promise<GetTokenDto> {
    const { baseUrl, realm, clientId } =
      this.keycloakApiConfig;

    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUrl,
    });

    const response = await axios.post<GetTokenDto>(
      `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return response.data;
  }
}
