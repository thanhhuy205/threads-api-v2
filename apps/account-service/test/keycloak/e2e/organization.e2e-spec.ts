import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import nock from 'nock';
import { UserModule } from '../../../src/modules/user/user.module';
import { keycloakApiConfiguration } from '../../../src/config/keycloak-api.config';
import { ConfigModule } from '@nestjs/config';

describe('Keycloak Organizations & Teams Full E2E (Strict HTTP & Keycloak Service Flow)', () => {
  let app: INestApplication;
  const keycloakBaseUrl = 'http://localhost:18081';
  const realm = 'purse-board';
  const clientId = 'purse-board-api';
  const clientSecretKey = 'mock-secret';

  beforeAll(async () => {
    nock.disableNetConnect();
    nock.enableNetConnect((host) => host.includes('127.0.0.1'));

    process.env.KEYCLOAK_API_BASE_URL = keycloakBaseUrl;
    process.env.KEYCLOAK_REALM = realm;
    process.env.KEYCLOAK_CLIENT_ID = clientId;
    process.env.KEYCLOAK_CLIENT_SECRET_KEY = clientSecretKey;

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [keycloakApiConfiguration],
        }),
        UserModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    nock.cleanAll();
    nock.enableNetConnect();
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('GET /organizations (findAll organizations)', () => {
    it('should complete the entire flow: authenticate to Keycloak, query Keycloak admin API, and return formatted ApiResponse', async () => {
      // 1. Strict Keycloak OAuth token request
      nock(keycloakBaseUrl)
        .post(`/realms/${realm}/protocol/openid-connect/token`, (body: string) => {
          const params = new URLSearchParams(body);
          return (
            params.get('client_id') === clientId &&
            params.get('client_secret') === clientSecretKey &&
            params.get('grant_type') === 'client_credentials'
          );
        })
        .matchHeader('content-type', 'application/x-www-form-urlencoded')
        .reply(200, {
          access_token: 'valid-realm-admin-token-123',
          expires_in: 300,
          token_type: 'Bearer',
        });

      // 2. Strict Keycloak Admin Organizations API call
      const keycloakOrganizations = [
        {
          id: 'org-uuid-001',
          name: 'Purse Global Org',
          alias: 'purse-global',
          domains: [{ name: 'purse.io' }],
        },
        {
          id: 'org-uuid-002',
          name: 'Fintech Division',
          alias: 'fintech-div',
          domains: [],
        },
      ];

      nock(keycloakBaseUrl)
        .get(`/admin/realms/${realm}/organizations`)
        .query({ first: '0', max: '10' })
        .matchHeader('Authorization', 'Bearer valid-realm-admin-token-123')
        .reply(200, keycloakOrganizations);

      // 3. Strict HTTP client request to our application endpoint
      const response = await request(app.getHttpServer())
        .get('/organizations')
        .query({ first: 0, max: 10 })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        statusCode: 200,
        pagination: null,
        data: keycloakOrganizations,
      });
    });

    it('should enforce strict query DTO validation (reject invalid query values)', async () => {
      const response = await request(app.getHttpServer())
        .get('/organizations')
        .query({ first: -5, max: 0 })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /organizations/:orgId/teams (Get orgId/teams)', () => {
    it('should complete the entire flow: authenticate to Keycloak, retrieve teams for the organization, and return formatted ApiResponse', async () => {
      const orgId = 'org-uuid-001';

      // 1. Strict Keycloak OAuth token request
      nock(keycloakBaseUrl)
        .post(`/realms/${realm}/protocol/openid-connect/token`)
        .reply(200, {
          access_token: 'valid-realm-admin-token-456',
          expires_in: 300,
          token_type: 'Bearer',
        });

      // 2. Strict Keycloak Admin Groups / Teams in Organization API call
      const keycloakTeams = [
        {
          id: 'team-backend-uuid',
          name: 'Backend Core',
          path: '/Backend Core',
          subGroups: [],
        },
        {
          id: 'team-mobile-uuid',
          name: 'Mobile App',
          path: '/Mobile App',
          subGroups: [],
        },
      ];

      nock(keycloakBaseUrl)
        .get(`/admin/realms/${realm}/organizations/${orgId}/groups`)
        .query({ first: '0', max: '20' })
        .matchHeader('Authorization', 'Bearer valid-realm-admin-token-456')
        .reply(200, keycloakTeams);

      // 3. Strict HTTP client request to our application endpoint
      const response = await request(app.getHttpServer())
        .get(`/organizations/${orgId}/teams`)
        .query({ first: 0, max: 20 })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        statusCode: 200,
        pagination: null,
        data: keycloakTeams,
      });
    });

    it('should enforce strict query DTO validation on team listing', async () => {
      const response = await request(app.getHttpServer())
        .get('/organizations/org-uuid-001/teams')
        .query({ first: 'invalid-string', max: -1 })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });
});
