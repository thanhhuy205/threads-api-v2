import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@purse/common/dto';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@Controller('users')
export class UserController {
  @Get(':publicId')
  @ApiOperation({ summary: 'Get a user by public ID' })
  @ApiParam({ name: 'publicId', type: String })
  findByPublicId(@Param('publicId') publicId: string) {
    return ApiResponse.ok({ publicId });
  }
}
