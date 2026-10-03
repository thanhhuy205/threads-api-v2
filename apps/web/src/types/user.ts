import type {
  BaseResponse,
  CursorAfterPaginationResponse,
} from "./api";

export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN" | string; // Thêm role
  verifiedAt: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isPrivate: boolean;
  location: string | null;
  website: string | null;
  labelWebsite?: string | null;
  createdAt: string;
  updatedAt?: string;
}
export type UserSuggestion = User;

export interface UpdateUserBody {
  _method?: "PUT";
  name?: string;
  username?: string;
  bio?: string;
  avatar?: File | null;
  isPrivate?: boolean | number;
}

export type UserSuggestionResponse = BaseResponse<UserSuggestion[]>;
export type UserResponse = Omit<BaseResponse<User>, "message">;

export type UserMentionItem = {
  id: string;
  username: string;
  name?: string | null;
  avatar?: string | null;
  verifiedAt?: Date | null;
};

export type UserMentionQueryDto = {
  q: string;
  after?: string;
  take?: number;
};

export type UserMentionResponse = BaseResponse<UserMentionItem[]> & {
  pagination: CursorAfterPaginationResponse;
};

export type UserProfile = Omit<
  User,
  "email" | "role" | "status" | "createdAt" | "updatedAt"
>;

export type UserProfileResponse = Omit<BaseResponse<UserProfile>, "message">;
