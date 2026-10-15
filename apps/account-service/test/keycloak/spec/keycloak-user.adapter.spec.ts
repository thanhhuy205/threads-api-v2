import { KeycloakUserAdapter } from '../../../src/modules/user/adapters/outbound/clients/keycloak/keycloak-user.adapter';
import { KeycloakClient } from '../../../src/modules/user/adapters/outbound/clients/keycloak/keycloak.client';
import { GetOrgsDTO, GetTeamInOrgDTO } from '../../../src/modules/user/adapters/outbound/clients/keycloak/dto/request';

describe('KeycloakUserAdapter', () => {
  let adapter: KeycloakUserAdapter;
  let mockKeycloakClient: jest.Mocked<KeycloakClient>;

  beforeEach(() => {
    mockKeycloakClient = {
      createTokenRealms: jest.fn(),
      getOrgs: jest.fn(),
      getTeamsInOrg: jest.fn(),
      getUserByTeam: jest.fn(),
      getOrgMembers: jest.fn(),
    } as unknown as jest.Mocked<KeycloakClient>;

    adapter = new KeycloakUserAdapter(mockKeycloakClient);
  });

  describe('getOrgs (findAll organizations)', () => {
    it('should obtain access token and call keycloakClient.getOrgs', async () => {
      const payload: GetOrgsDTO = { first: 0, max: 20 };
      const token = 'mock-access-token';
      const expectedOrgs = [{ id: 'org-1', name: 'Org 1' }];

      mockKeycloakClient.createTokenRealms.mockResolvedValue({ access_token: token } as any);
      mockKeycloakClient.getOrgs.mockResolvedValue(expectedOrgs as any);

      const result = await adapter.getOrgs(payload);

      expect(mockKeycloakClient.createTokenRealms).toHaveBeenCalledTimes(1);
      expect(mockKeycloakClient.getOrgs).toHaveBeenCalledWith(token, payload);
      expect(result).toEqual(expectedOrgs);
    });
  });

  describe('getTeamsInOrg (Get orgId/teams)', () => {
    it('should obtain access token and call keycloakClient.getTeamsInOrg with orgId and payload', async () => {
      const orgId = 'org-456';
      const payload: GetTeamInOrgDTO = { first: 0, max: 20 };
      const token = 'mock-access-token';
      const expectedTeams = [{ id: 'team-1', name: 'Alpha Team' }];

      mockKeycloakClient.createTokenRealms.mockResolvedValue({ access_token: token } as any);
      mockKeycloakClient.getTeamsInOrg.mockResolvedValue(expectedTeams as any);

      const result = await adapter.getTeamsInOrg(orgId, payload);

      expect(mockKeycloakClient.createTokenRealms).toHaveBeenCalledTimes(1);
      expect(mockKeycloakClient.getTeamsInOrg).toHaveBeenCalledWith(token, orgId, payload);
      expect(result).toEqual(expectedTeams);
    });
  });
});
