export type GetPostWithUser = {
    after?: string;
    take: number;
    userId: string;
    myUserId?: string;
};
