import { NewFeedType } from '@/modules/post/enum';

export type NewsFeedPayload = {
    currentPage: number;
    perPage: number;
    userId: string | null;
    feedType?: NewFeedType;
};
