export const authKeys = {
  all: ["auth"] as const,
  currentUser: ["auth", "current-user"] as const,
  validateResetToken: (token: string) =>
    ["auth", "validate-reset-token", token] as const,
};
