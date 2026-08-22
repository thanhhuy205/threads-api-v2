import type { HttpResponse } from '@/common/types/http.type';
import { HttpException } from '@/errors/error';
import { COMMON_MESSAGE } from '@libs/core/constants/message';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  BadRequestException as NestBadRequestException,
  HttpException as NestHttpException,
} from '@nestjs/common';

type ValidationErrorResponse = {
  message?: string;
  errors?: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name, { timestamp: true }); // Replace with your preferred logger
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponse>();

    if (exception instanceof HttpException) {
      this.logger.error(exception.message);
      response.status(exception.statusCode).json({
        success: false,
        message: exception.message,
        ...(exception.errorCode ? { errorCode: exception.errorCode } : {}),
      });
      return;
    }

    if (exception instanceof NestBadRequestException) {
      const payload = exception.getResponse() as ValidationErrorResponse;
      response.status(400).json({
        success: false,
        message: payload.message ?? COMMON_MESSAGE.VALIDATION_FAILED,
        ...(payload.errors ? { errors: payload.errors } : {}),
      });
      return;
    }

    // if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    //   const prismaErrors: Record<string, { status: number; message: string }> = {
    //     P2002: { status: 409, message: COMMON_MESSAGE.RESOURCE_ALREADY_EXISTS },
    //     P2025: { status: 404, message: COMMON_MESSAGE.RESOURCE_NOT_FOUND },
    //     P2003: { status: 400, message: COMMON_MESSAGE.INVALID_RELATION_REFERENCE },
    //     P2011: { status: 400, message: COMMON_MESSAGE.MISSING_REQUIRED_DATA },
    //     P2012: { status: 400, message: COMMON_MESSAGE.MISSING_REQUIRED_DATA },
    //     P2013: { status: 400, message: COMMON_MESSAGE.MISSING_REQUIRED_DATA },
    //   };
    //   const mapped = prismaErrors[exception.code] ?? {
    //     status: 400,
    //     message: COMMON_MESSAGE.DATABASE_REQUEST_ERROR,
    //   };
    //   response.status(mapped.status).json({
    //     success: false,
    //     message: mapped.message,
    //     ...(exception.meta?.target ? { field: exception.meta.target } : {}),
    //   });
    //   return;
    // }

    if (exception instanceof NestHttpException) {
      const payload = exception.getResponse();
      const message = typeof payload === 'string'
        ? payload
        : (payload as { message?: string | string[] }).message;
      response.status(exception.getStatus()).json({ success: false, message });
      return;
    }
    this.logger.error('Unhandled exception:', exception);
    response.status(500).json({
      success: false,
      message: COMMON_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
}
