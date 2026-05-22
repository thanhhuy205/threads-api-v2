export interface ElasticPostRequestDto {
  postId: number;
  publicId: string;
  userId: string;
  content: string;
  authorUsername: string;
  authorName?: string | null;
  topic?: string;
  createdAt: string;
}
