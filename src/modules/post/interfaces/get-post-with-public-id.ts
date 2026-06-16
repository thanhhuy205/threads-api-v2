export type GetPostWithPublicId = {
    after?: string;
    take: number;
    publicId: string;
    userId?: string | null;
};
