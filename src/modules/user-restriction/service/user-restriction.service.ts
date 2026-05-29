import { Prisma, UserRestrictionType } from "@prisma/client";
import { userRestrictionRepository } from "../repository/user-restriction.repository";

type CreateUserRestrictionInput = {
    userId: string;
    type: UserRestrictionType;
    reason?: string;
    expiresAt: Date;
};

class UserRestrictionService {

    async checkUserRestriction(userId: string) {
        const restriction = await userRestrictionRepository.findFirstActive(userId);

        if (restriction) {
            throw new Error("USER_RESTRICTED");
        }

        return restriction;
    }


    async getActiveRestriction(userId: string) {
        return userRestrictionRepository.findFirstActive(userId);
    }

    async create(
        data: CreateUserRestrictionInput,
        tx?: Prisma.TransactionClient,
    ) {
        return userRestrictionRepository.create(data, tx);
    }
}

export const userRestrictionService = new UserRestrictionService();
