import { ActionType } from "@prisma/client";

export interface CreateAntiSpamInput {
    userId: string;
    action: ActionType;
    reason?: string;
}
