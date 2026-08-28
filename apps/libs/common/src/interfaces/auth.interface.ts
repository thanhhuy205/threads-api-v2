import { JwtTokenType } from '../enums/jwt.enum';
import { UserRoleType as Role } from '../enums/prisma.enum';

export interface TokenPayload {
  id: string;
  email: string;
  jti: string;
  role?: Role;
  type: JwtTokenType;
  iss: string;
  key: string;
}

export interface UserRequestPayload {
  id: string;
  jti: string;
  email: string;
  role?: Role;
  emailVerified?: boolean;
}
