import { NewFeedType } from '@/modules/post/enum';

export type NewsFeedPayload = {
    after?: string;
    take: number;
    userId: string | null;
    feedType?: NewFeedType;
};
