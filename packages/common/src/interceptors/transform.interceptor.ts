import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../dto/response/api-response.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>> {

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((result: any) => {
        const pagination = result.pagination ?? null;
        return {
          statusCode: res.statusCode ?? 200,
          data: result.data,
          ...(pagination ? { pagination: result.pagination } : {}),
        };
      }),
    );
  }
}