import { Controller, Get } from '@nestjs/common';
import { IsPublic } from '@purse/common/decorators';

@IsPublic()
@Controller('health')
export class HealthController {
  @Get('ping')
  ping() {
    return { data: 'pong' };
  }
}
