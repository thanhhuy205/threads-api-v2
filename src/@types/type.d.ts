
declare global {
    namespace Express {
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
        }
    }
}

export { };

