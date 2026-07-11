type UserProfileForFEInput = {
  [key: string]: unknown;
  hasReceivedFriendRequest?: boolean;
  hasSentFriendRequest?: boolean;
  isFollowing?: boolean;
};

export const mapUserProfileForFE = <
  T extends UserProfileForFEInput,
>(
  user: T,
) => {
  const {
    hasReceivedFriendRequest,
    hasSentFriendRequest,
    isFollowing,
    isFriend,
    ...rest
  } = user;

  return {
    ...rest,
    hasReceivedFriendRequest: Boolean(hasReceivedFriendRequest),
    hasSentFriendRequest: Boolean(hasSentFriendRequest),
    isFollowing: Boolean(isFollowing),
    isFriend: Boolean(isFriend),
  };
};
