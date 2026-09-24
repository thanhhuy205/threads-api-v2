export type NewsFeedCommand = {
  after?: string;
  take: number;
  userId: string | null;
  type: 'for_you';
};
