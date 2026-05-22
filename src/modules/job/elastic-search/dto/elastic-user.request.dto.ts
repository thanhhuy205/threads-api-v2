export interface ElasticUserRequestDto {
  userId: string;
  username: string;
  name?: string | null;
  bio?: string | null;
  avatar?: string | null;
  isVerified?: boolean;
  createdAt: string;
}
