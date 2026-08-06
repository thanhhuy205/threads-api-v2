import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGE_METADATA_KEY } from '../decorators/message.decorator';
import { PAGINATION_METADATA_KEY } from '../decorators/pagination.decorator';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationResponse<T> extends Response<T> {
  pagination: unknown;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T> | PaginationResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T> | PaginationResponse<T>> {
    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE_METADATA_KEY,
      context.getHandler(),
    );
    const pagination = this.reflector.get<boolean>(
      PAGINATION_METADATA_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((result) => {
        const messagePayload = message ? { message } : {};

        if (pagination) {
          const paginatedResult = result as T & { data: T; pagination: unknown };
          return {
            success: true,
            data: paginatedResult.data ?? null,
            pagination: paginatedResult.pagination,
            ...messagePayload,
          } as PaginationResponse<T>;
        }

        return {
          success: true,
          data: result ?? null,
          ...messagePayload,
        } as Response<T>;
      }),
    );
  }
}
