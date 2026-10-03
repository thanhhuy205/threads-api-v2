export const notificationKeys = {
  all: ["notification"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: () => [...notificationKeys.lists(), "all"] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
  message: () => [...notificationKeys.all, "message"] as const,
};
