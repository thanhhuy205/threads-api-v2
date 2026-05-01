import type { UserStatus } from '@prisma/client';

export interface PayloadSignTokenDto {
    userId: string;
    status: UserStatus;
    sessionId?: string;
}