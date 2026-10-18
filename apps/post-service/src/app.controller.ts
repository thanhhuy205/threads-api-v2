import { Controller, Get } from '@nestjs/common';
import { IsPublic } from '@purse/common/decorators';
import { ApiResponse } from '@purse/common/dto';

@IsPublic()
@Controller('health')
export class AppController {
  @Get('ping')
  ping() {
    return ApiResponse.ok('pong');
  }
}
