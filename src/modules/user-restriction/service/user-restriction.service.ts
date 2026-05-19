import { userRestrictionRepository } from "../repository/user-restriction.repository";

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
}

export const userRestrictionService = new UserRestrictionService();
