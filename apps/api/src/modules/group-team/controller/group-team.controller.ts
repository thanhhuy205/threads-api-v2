import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { Message } from '@/common/decorators/message.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AddUserTeamDto,
  CreateGroupTeamDto,
  GroupTeamParamsDto,
} from '../dto/request';
import { GroupTeamService } from '../service/group-team.service';

@ApiTags('Group Team')
@ApiBearerAuth('bearer')
@Controller('group-teams')
export class GroupTeamController {
  constructor(private readonly groupTeamService: GroupTeamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Message('Team created successfully')
  @ApiOperation({ summary: 'Create a team' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Team created successfully' })
  create(
    @Body() payload: CreateGroupTeamDto,
    @GetUserId() userId: string,
  ) {
    return this.groupTeamService.create({
      name: payload.name,
      createdById: userId,
    });
  }

  @Post(':teamPublicId/members')
  @HttpCode(HttpStatus.CREATED)
  @Message('User added to team successfully')
  @ApiOperation({ summary: 'Add a user to a team' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User added successfully' })
  addMember(
    @Param() params: GroupTeamParamsDto,
    @Body() payload: AddUserTeamDto,
    @GetUserId() userId: string,
  ) {
    return this.groupTeamService.addMember({
      teamPublicId: params.teamPublicId,
      userId: payload.userId,
      position: payload.position,
      requestedById: userId,
    });
  }
}
