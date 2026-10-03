import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Organizations')
@ApiBearerAuth('bearer')
@Controller('organizations')
export class OrganizationController {
  @Get(':orgId/teams')
  @ApiOperation({ summary: 'List users in an organization' })
  @ApiParam({ name: 'orgId', type: String })
  findTeams(@Param('orgId') orgId: string) {}
}
