import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '@purse/common/decorators';
import type {
  KeycloakUserAdapter,
} from '../../../application/ports/outbound/keycloak.port';
import { KEYCLOAK_USER_ADAPTER } from '../../../application/ports/outbound/keycloak.port';
import {
  GetOrgsDTO,
  GetTeamInOrgDTO,
} from '../../outbound/clients/keycloak/dto/request';

@ApiTags('Organizations')
@ApiBearerAuth('bearer')
@Controller('organizations')
export class OrganizationController {
  constructor(
    @Inject(KEYCLOAK_USER_ADAPTER)
    private readonly keycloakUserAdapter: KeycloakUserAdapter,
  ) { }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'List organizations' })
  findAll(@Query() payload: GetOrgsDTO) {
    return this.keycloakUserAdapter.getOrgs(payload);
  }

  @Get(':orgId/teams')
  @ApiOperation({ summary: 'List users in an organization' })
  @ApiParam({ name: 'orgId', type: String })
  findTeams(
    @Param('orgId') orgId: string,
    @Query() payload: GetTeamInOrgDTO,
  ) {
    return this.keycloakUserAdapter.getTeamsInOrg(orgId, payload);
  }
}
