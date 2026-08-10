import type { UserRoleType } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    roles: UserRoleType[];
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT?: string;
      DATABASE_URL?: string;
      JWT_SECRET?: string;
      LEONARDO_API_KEY?: string;
      ACCESS_EXPIRES?: string;
      REDIS_URL?: string;
    }
  }
}

export { };

