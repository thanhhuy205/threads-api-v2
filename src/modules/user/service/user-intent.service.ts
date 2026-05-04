import type { CreateFeedIntentPayload } from '@/modules/user/interfaces/create-feed-intent-payload';
import { userIntentRepository } from '../repository/user-intent.repository';

class UserIntentService {
    async getFeedIntent(): Promise<void> { }

    async createFeedIntent(payload: CreateFeedIntentPayload): Promise<void> {
        await userIntentRepository.upsertByUserId({
            userId: payload.sub,
            positiveText: payload.positiveText,
            negativeText: payload.negativeText,
        });
    }

    async updateFeedIntent(): Promise<void> { }

    async deleteFeedIntent(): Promise<void> { }
}

export const userIntentService = new UserIntentService();
