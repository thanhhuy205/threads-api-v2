import { ActionType } from "@prisma/client";

export interface FindAntiSpamByUserActionInDayInput {
    userId: string;
    action: ActionType;
    date: Date;
}
