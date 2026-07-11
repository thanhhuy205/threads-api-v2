import { limitActionRepository } from "@/modules/limit-action/repository/limit-action.repository";

class LimitActionService {
    async getLimitActionByUserId(userId: string) {
        return limitActionRepository.findManyByUserId(userId);
    }


    async createLimitAction({ userId, type, resetAt }: { userId: string; type: string; resetAt: Date }) {
        return limitActionRepository.create({
            userId,
            type: type as any,
            resetAt,
        });
    }
}

export const limitActionService = new LimitActionService();