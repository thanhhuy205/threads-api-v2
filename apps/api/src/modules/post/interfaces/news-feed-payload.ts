export type NewsFeedPayload = {
    after?: string;
    take: number;
    userId: string | null;
};
