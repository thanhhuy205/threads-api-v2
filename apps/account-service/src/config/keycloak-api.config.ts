import { registerAs } from '@nestjs/config';

export type KeycloakApiConfig = {
  baseUrl: string;
  realm: string;
  clientId: string;
  clientSecretKey: string;
};

export const keycloakApiConfiguration = registerAs<KeycloakApiConfig>(
  'keycloakApi',
  () => ({
    baseUrl: process.env.KEYCLOAK_API_BASE_URL ?? 'http://localhost:18081',
    realm: process.env.KEYCLOAK_REALM ?? 'purse-board',
    clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'purse-board-api',
    clientSecretKey: process.env.KEYCLOAK_CLIENT_SECRET_KEY ?? '',
  }),
);
