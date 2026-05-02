import prisma from '@/config/prisma';

type UpsertUserIntentPayload = {
    userId: string;
    positiveText?: string;
    negativeText?: string;
};

class UserIntentRepository {
    async upsertByUserId(payload: UpsertUserIntentPayload): Promise<void> {
        await prisma.userIntent.upsert({
            where: {
                userId: payload.userId,
            },
            create: {
                userId: payload.userId,
                positiveText: payload.positiveText,
                negativeText: payload.negativeText,
            },
            update: {
                positiveText: payload.positiveText,
                negativeText: payload.negativeText,
            },
        });
    }
}

export const userIntentRepository = new UserIntentRepository();
