import { OrganizationController } from '../../../src/modules/user/adapters/inbound/http/organization.controller';
import type { KeycloakUserAdapter } from '../../../src/modules/user/application/ports/outbound/keycloak.port';
import { GetOrgsDTO, GetTeamInOrgDTO } from '../../../src/modules/user/adapters/outbound/clients/keycloak/dto/request';
import { ApiResponse } from '@purse/common/dto';

describe('OrganizationController (Keycloak)', () => {
  let controller: OrganizationController;
  let mockKeycloakUserAdapter: jest.Mocked<KeycloakUserAdapter>;

  beforeEach(() => {
    mockKeycloakUserAdapter = {
      getOrgs: jest.fn(),
      getTeamsInOrg: jest.fn(),
      getUserByTeam: jest.fn(),
      getOrgMembers: jest.fn(),
    } as unknown as jest.Mocked<KeycloakUserAdapter>;

    controller = new OrganizationController(mockKeycloakUserAdapter);
  });

  describe('findAll (organizations)', () => {
    it('should return list of organizations successfully', async () => {
      const query: GetOrgsDTO = { first: 0, max: 10 };
      const mockOrgs = [
        { id: 'org-1', name: 'Engineering', alias: 'eng' },
        { id: 'org-2', name: 'Product', alias: 'prod' },
      ];

      mockKeycloakUserAdapter.getOrgs.mockResolvedValue(mockOrgs as any);

      const response = await controller.findAll(query);

      expect(mockKeycloakUserAdapter.getOrgs).toHaveBeenCalledWith(query);
      expect(mockKeycloakUserAdapter.getOrgs).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ApiResponse.ok(mockOrgs));
    });
  });

  describe('findTeams (Get orgId/teams)', () => {
    it('should return list of teams for a specific organization', async () => {
      const orgId = 'org-123';
      const query: GetTeamInOrgDTO = { first: 0, max: 20 };
      const mockTeams = [
        { id: 'team-1', name: 'Backend', path: '/Backend' },
        { id: 'team-2', name: 'Frontend', path: '/Frontend' },
      ];

      mockKeycloakUserAdapter.getTeamsInOrg.mockResolvedValue(mockTeams as any);

      const response = await controller.findTeams(orgId, query);

      expect(mockKeycloakUserAdapter.getTeamsInOrg).toHaveBeenCalledWith(orgId, query);
      expect(mockKeycloakUserAdapter.getTeamsInOrg).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ApiResponse.ok(mockTeams));
    });
  });
});
