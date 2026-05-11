import type { UserRoleType, UserStatus } from "@prisma/client";

export interface PayloadSignTokenDto {
  userId: string;
  status: UserStatus;
  roles: UserRoleType[];
  sessionId?: string;
}
