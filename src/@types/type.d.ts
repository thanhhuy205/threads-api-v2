import type { UserRoleType } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    roles: UserRoleType[];
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      accessToken?: string;
      query_parsed?: any;
    }

    namespace Multer {
      interface File {
        resizedBuffer?: Buffer<ArrayBufferLike>;
      }
    }
    interface Response {
      success(
        status: HttpsCode,
        message?: string,
        data?: any,
        passProps = {},
      ): Response;
      error(
        status: HttpsCode,
        message?: string,
        errors?: any,
        passProps = {},
      ): Response;
      paginate(payload: { rows: any; pagination: any }): Response;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT?: string;
      DATABASE_URL?: string;
      JWT_SECRET?: string;
      ACCESS_EXPIRES?: string;
      REDIS_URL?: string;
    }
  }
}

export { };
