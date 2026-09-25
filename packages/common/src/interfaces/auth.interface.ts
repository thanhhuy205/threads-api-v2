import { JwtTokenType } from '../enums/jwt.enum';
import { UserRoleType as Role } from '../enums/prisma.enum';

export interface TokenPayload {
  id: string;
  email: string;
  jti: string;
  role?: Role | Role[];
  type: JwtTokenType;
  iss?: string;
  key: string;
}

export interface UserRequestPayload {
  id: string;
  jti: string;
  email: string;
  role?: Role | Role[];
  scope?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
}
