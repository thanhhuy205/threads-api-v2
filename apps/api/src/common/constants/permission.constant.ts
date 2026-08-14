export const PERMISSIONS = {
  POST_CREATE: 'post:create',
  POST_PIN: 'post:pin',
  POST_EXPIRE: 'post:expire',
  ANNOUNCEMENT_CREATE: 'announcement:create',
  GROUP_CREATE: 'group:create',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
