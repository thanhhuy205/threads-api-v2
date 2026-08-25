export type GetPostWithPublicIdCommand = {
  after?: string;
  take: number;
  publicId: string;
  userId?: string | null;
};
