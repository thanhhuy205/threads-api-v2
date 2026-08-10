import { Message } from '@/common/decorators/message.decorator';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { AUTH_MESSAGE } from '@/constants/message';
import { UnauthorizedException } from '@/errors/error';
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HttpRequest as Request } from '@/common/types/http.type';
import { GenerateImageRequestDto } from '../dto/request/generate-image.request.dto';
import { AiService } from '../service/ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('generate-image')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    @Message('Image generation job created')
    @ApiBearerAuth('bearer')
    @ApiOperation({ summary: 'Submit an image generation job' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Image generation job created' })
    async generateImageCaption(
        @Body() payload: GenerateImageRequestDto,
        @Req() req: Request,
    ) {
        const userId = req.user?.sub;

        if (!userId) {
            throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
        }

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
