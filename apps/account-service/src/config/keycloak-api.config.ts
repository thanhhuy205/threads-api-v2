import { registerAs } from '@nestjs/config';

export type KeycloakApiConfig = {
  baseUrl: string;
  realm: string;
  clientId: string;
  apiClientId: string;
  apiClientSecretKey: string;
};

export const keycloakApiConfiguration = registerAs<KeycloakApiConfig>(
  'keycloakApi',
  () => ({
    baseUrl: process.env.KEYCLOAK_API_BASE_URL ?? 'http://localhost:18081',
    realm: process.env.KEYCLOAK_REALM ?? 'purse-board',
    clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'purse-board-api',
    apiClientId:
      process.env.KEYCLOAK_API_CLIENT_ID ??
      'purse-board-api',
    apiClientSecretKey:
      process.env.KEYCLOAK_API_CLIENT_SECRET_KEY ??
      '',
  }),
);
