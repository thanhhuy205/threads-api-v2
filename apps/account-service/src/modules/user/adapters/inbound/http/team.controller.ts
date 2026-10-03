import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Teams')
@ApiBearerAuth('bearer')
@Controller('teams')
export class TeamController {
  @Get(':teamId/users')
  @ApiOperation({ summary: 'List users in a team' })
  @ApiParam({ name: 'teamId', type: String })
  findUsers(@Param('teamId') teamId: string) {}
}
