import { UPLOAD_MESSAGE } from '@/constants/message';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { Message } from '@/common/decorators/message.decorator';
import { ResizeUploadInterceptor } from '@/common/interceptors/resize-upload.interceptor';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadService } from '../service/upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('avatar')
    @HttpCode(HttpStatus.CREATED)
    @Message(UPLOAD_MESSAGE.UPLOAD_AVATAR_SUCCESS)
    @UseInterceptors(
        FileInterceptor('file'),
        ResizeUploadInterceptor,
    )
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload an avatar image' })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file'],
            properties: { file: { type: 'string', format: 'binary' } },
        },
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: UPLOAD_MESSAGE.UPLOAD_AVATAR_SUCCESS })
    async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadImage(file);
    }

    @Post('media')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessTokenGuard)
    @Message(UPLOAD_MESSAGE.UPLOAD_MEDIA_SUCCESS)
    @UseInterceptors(
        FilesInterceptor('medias', 5),
        ResizeUploadInterceptor,
    )
    @ApiBearerAuth('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload post media' })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['medias'],
            properties: {
                medias: { type: 'array', items: { type: 'string', format: 'binary' } },
            },
        },
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: UPLOAD_MESSAGE.UPLOAD_MEDIA_SUCCESS })
    async uploadMedia(@UploadedFiles() files: Express.Multer.File[] = []) {
        return this.uploadService.uploadMedia(files);
    }
}
