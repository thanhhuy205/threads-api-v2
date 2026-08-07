import { Module } from '@nestjs/common';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { ResizeUploadInterceptor } from '@/common/interceptors/resize-upload.interceptor';
import { UploadController } from './controller/upload.controller';
import { PostMediaRepository } from './repository/post-media.repository';
import { UploadService } from './service/upload.service';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    PostMediaRepository,
    AccessTokenGuard,
    ResizeUploadInterceptor,
  ],
  exports: [UploadService],
})
export class UploadModule {}
