import type { UserProfile } from "../repository/user.repository";

export type FollowerUserDto = Pick<UserProfile, "id" | "username" | "name" | "verifiedAt">;

type FollowWithUser = {
  user: {
    id: string;
    username: string;
    name: string | null;
    verifiedAt: Date | null;
  };
};

export const toFollowerUserDto = (follow: FollowWithUser): FollowerUserDto => ({
  id: follow.user.id,
  username: follow.user.username,
  name: follow.user.name,
  verifiedAt: follow.user.verifiedAt,
});
