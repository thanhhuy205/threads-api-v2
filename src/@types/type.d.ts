
import type { UserRole } from '@prisma/client';
import type { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            accessToken?: string;
            isAdmin?: UserRole;
            query_parsed?: any;
        }

        interface Response {
            success(status: HttpsCode, message?: string, data?: any, passProps = {}): Response;
            error(status: HttpsCode, message?: string, errors?: any, passProps = {}): Response;
            paginate(payload: { rows: any; pagination: any }): Response;
        }
    }

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT?: string;
            DATABASE_URL?: string;
            JWT_SECRET?: string;
            ACCESS_EXPIRES?: string;
            REDIS_URL?: string;
        }
    }
}

export { };

