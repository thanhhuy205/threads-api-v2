import { COMMON_MESSAGE } from '@/constants/message';

export class HttpException extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly errorCode?: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string = COMMON_MESSAGE.BAD_REQUEST, errorCode?: string) {
        super(400, message, errorCode);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string = COMMON_MESSAGE.UNAUTHORIZED, errorCode?: string) {
        super(401, message, errorCode);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message: string = COMMON_MESSAGE.FORBIDDEN, errorCode?: string) {
        super(403, message, errorCode);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string = COMMON_MESSAGE.NOT_FOUND, errorCode?: string) {
        super(404, message, errorCode);
    }
}

export class ConflictException extends HttpException {
    constructor(message: string = COMMON_MESSAGE.CONFLICT, errorCode?: string) {
        super(409, message, errorCode);
    }
}