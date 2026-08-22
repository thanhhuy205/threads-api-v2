import { Message } from "@/common/decorators/message.decorator";
import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export const ResponseOperation = (
    message: string,
    statusCode: HttpStatus,
    summary: string = message,
) => applyDecorators(
    Message(message),
    HttpCode(statusCode),
    ApiOperation({ summary }),
    ApiResponse({ status: statusCode, description: message }),
);
