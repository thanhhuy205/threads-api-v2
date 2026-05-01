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
    constructor(message = "Bad request", errorCode?: string) {
        super(400, message, errorCode);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized", errorCode?: string) {
        super(401, message, errorCode);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = "Forbidden", errorCode?: string) {
        super(403, message, errorCode);
    }
}

export class NotFoundException extends HttpException {
    constructor(message = "Not found", errorCode?: string) {
        super(404, message, errorCode);
    }
}

export class ConflictException extends HttpException {
    constructor(message = "Conflict", errorCode?: string) {
        super(409, message, errorCode);
    }
}