export type GetPostWithUserCommand = {
  after?: string;
  take: number;
  userId: string;
  myUserId?: string;
};
