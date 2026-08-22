import { IsPublic } from '@/common/decorators/is-public.decorator';
import { Message } from '@/common/decorators/message.decorator';
import { HEALTH_MESSAGE } from '@libs/core/constants/message';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) { }

    @Get()
    @IsPublic()
    @Message(HEALTH_MESSAGE.SERVICE_IS_HEALTHY)
    @ApiOperation({ summary: 'Check service health' })
    @ApiResponse({ status: 200, description: HEALTH_MESSAGE.SERVICE_IS_HEALTHY })
    getHealth() {
        return this.healthService.buildHealthPayload();
    }
}
