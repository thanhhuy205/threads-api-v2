import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type {
  KeycloakUserAdapter,
} from '../../../application/ports/outbound/keycloak.port';
import { KEYCLOAK_USER_ADAPTER } from '../../../application/ports/outbound/keycloak.port';
import { GetUserByTeamDTO } from '../../outbound/clients/keycloak/dto/request';

@ApiTags('Teams')
@ApiBearerAuth('bearer')
@Controller('teams')
export class TeamController {
  constructor(
    @Inject(KEYCLOAK_USER_ADAPTER)
    private readonly keycloakUserAdapter: KeycloakUserAdapter,
  ) {}

  @Get(':orgId/teams/:teamId/users')
  @ApiOperation({ summary: 'List users in a team' })
  @ApiParam({ name: 'teamId', type: String })
  @ApiParam({ name: 'orgId', type: String })
  findUsers(
    @Param('teamId') teamId: string,
    @Param('orgId') orgId: string,
    @Query() payload: GetUserByTeamDTO,
  ) {
    return this.keycloakUserAdapter.getUserByTeam(orgId, teamId, payload);
  }
}
