import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ResizeUploadInterceptor } from '@/common/interceptors/resize-upload.interceptor';
import { CloudflareModule } from '@libs/storage/cloudflare.module';
import { UploadController } from './controller/upload.controller';
import { PostMediaRepository } from './repository/post-media.repository';
import { UploadService } from './service/upload.service';

@Module({
  imports: [
    CloudflareModule,
    MulterModule.register({
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
          return callback(new Error('Chỉ cho phép file ảnh hoặc video'), false);
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    PostMediaRepository,
    ResizeUploadInterceptor,
  ],
  exports: [UploadService],
})
export class UploadModule {}
