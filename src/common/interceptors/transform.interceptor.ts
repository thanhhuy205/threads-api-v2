import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGE_METADATA_KEY } from '../decorators/message.decorator';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE_METADATA_KEY,
      context.getHandler(),
    );
    return next.handle().pipe(
      map((result) => {
        const messagePayload = message ? { message } : {};
        const isPaginated = Boolean(
          result && typeof result === 'object' && 'pagination' in result,
        );

        if (isPaginated) {
          const paginatedResult = result as T & { data: T; pagination: unknown };
          return {
            success: true,
            data: paginatedResult.data ?? null,
            pagination: paginatedResult.pagination,
            ...messagePayload,
          };
        }

        return {
          success: true,
          data: result ?? null,
          ...messagePayload,
        };
      }),
    );
  }
}
