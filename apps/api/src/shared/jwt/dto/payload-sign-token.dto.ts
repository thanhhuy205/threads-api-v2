import type { UserRoleType, UserStatus } from "../../../../generated/prisma";

export interface PayloadSignTokenDto {
  userId: string;
  status: UserStatus;
  roles: UserRoleType[];
  sessionId?: string;
}
