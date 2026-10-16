import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '@purse/common/decorators';
import { ApiResponse } from '@purse/common/dto';
import type {
  KeycloakUserAdapter,
} from '../../../application/ports/outbound/keycloak.port';
import { KEYCLOAK_USER_ADAPTER } from '../../../application/ports/outbound/keycloak.port';
import {
  GetOrgsCommand,
  GetTeamInOrgCommand,
} from '../../../application/commands/keycloak';

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
  async findAll(@Query() payload: GetOrgsCommand) {
    const result = await this.keycloakUserAdapter.getOrgs(payload);
    return ApiResponse.ok(result);
  }
  @IsPublic()
  @Get(':orgId/teams')
  @ApiOperation({ summary: 'List users in an organization' })
  @ApiParam({ name: 'orgId', type: String })
  async findTeams(
    @Param('orgId') orgId: string,
    @Query() payload: GetTeamInOrgCommand,
  ) {
    const result = await this.keycloakUserAdapter.getTeamsInOrg(orgId, payload);
    return ApiResponse.ok(result);
  }
}
