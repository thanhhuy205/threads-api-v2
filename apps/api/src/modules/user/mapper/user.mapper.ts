type UserProfileForFEInput = {
  [key: string]: unknown;
};

export const mapUserProfileForFE = <
  T extends UserProfileForFEInput,
>(
  user: T,
) => {
  const {
    ...rest
  } = user;

  return {
    ...rest,
    ...rest,
  };
};
