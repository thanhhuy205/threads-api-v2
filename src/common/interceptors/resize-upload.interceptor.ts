import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { handlerResize } from '@/middlewares/shape';

const resizableImageMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

@Injectable()
export class ResizeUploadInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<{
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }>();
    const files = request.file ? [request.file] : (request.files ?? []);

    await Promise.all(
      files.map(async (file) => {
        if (!resizableImageMimeTypes.has(file.mimetype)) {
          return;
        }

        const resized = await handlerResize(file.buffer);
        file.resizedBuffer = resized.buffer;
        file.width = resized.width ?? undefined;
        file.height = resized.height ?? undefined;
      }),
    );

    return next.handle();
  }
}
