import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { Message } from '@/common/decorators/message.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateImageRequestDto } from '../dto/request/generate-image.request.dto';
import { AiService } from '../service/ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('generate-image')
    @HttpCode(HttpStatus.OK)
    @Message('Image generation job created')
    @ApiBearerAuth('bearer')
    @ApiOperation({ summary: 'Submit an image generation job' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Image generation job created' })
    async generateImageCaption(
        @Body() payload: GenerateImageRequestDto,
        @GetUserId() userId: string,
    ) {
        const sdGenerationJob = await this.aiService.generateImageCaption({
            content: payload.content,
            userId,
        });
        const publicSdGenerationJob = { ...sdGenerationJob } as Record<string, unknown>;
        delete publicSdGenerationJob.apiCreditCost;
        delete publicSdGenerationJob.cost;
        return { sdGenerationJob: publicSdGenerationJob };
    }
}
