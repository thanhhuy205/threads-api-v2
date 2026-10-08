// Shared representations of every enum declared in the Prisma schemas.
// Keep each member synchronized with its corresponding Prisma enum.

export enum UserRoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  WORKSPACE_OWNER = 'WORKSPACE_OWNER',
}

export const PostType = {
  POST: 'POST',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  DECIDE: 'DECIDE',
} as const;

export type PostType = (typeof PostType)[keyof typeof PostType];

export enum QueueStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum VerificationCodeType {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export const ReplyPermission = {
  EVERYONE: 'EVERYONE',
  FOLLOWERS: 'FOLLOWERS',
  FOLLOWING: 'FOLLOWING',
  MENTIONED: 'MENTIONED',
} as const;

export type ReplyPermission = (typeof ReplyPermission)[keyof typeof ReplyPermission];

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  DEACTIVATED = 'DEACTIVATED',
}

export const VisibilityPost = {
  WORKSPACE: 'WORKSPACE',
  GROUP: 'GROUP',
  CUSTOM: 'CUSTOM',
  ONLY_ME: 'ONLY_ME',
} as const;

export type VisibilityPost = (typeof VisibilityPost)[keyof typeof VisibilityPost];

export enum PermissionScope {
  WORKSPACE = 'WORKSPACE',
  GROUP = 'GROUP',
}

export enum Position {
  SOFTWARE_ENGINEER = 'SOFTWARE_ENGINEER',
  SENIOR_SOFTWARE_ENGINEER = 'SENIOR_SOFTWARE_ENGINEER',
  INTERN_SOFTWARE_ENGINEER = 'INTERN_SOFTWARE_ENGINEER',
  TECH_LEAD = 'TECH_LEAD',
  DATA_SCIENTIST = 'DATA_SCIENTIST',
  PRODUCT_MANAGER = 'PRODUCT_MANAGER',
  DESIGNER = 'DESIGNER',
  HR = 'HR',
  MARKETING_SPECIALIST = 'MARKETING_SPECIALIST',
  SALES_REPRESENTATIVE = 'SALES_REPRESENTATIVE',
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  CONTENT_CREATOR = 'CONTENT_CREATOR',
  BUSINESS_ANALYST = 'BUSINESS_ANALYST',
  CTO = 'CTO',
  CEO = 'CEO',
  FOUNDER = 'FOUNDER',
  OTHER = 'OTHER',
}

export enum ActionType {
  POST_CREATED = 'POST_CREATED',
  POST_DELETED = 'POST_DELETED',
  LIKE_CREATED = 'LIKE_CREATED',
  FLOW_FOLLOWER_CREATED = 'FLOW_FOLLOWER_CREATED',
  FOLLOW_FOLLOWING_CREATED = 'FOLLOW_FOLLOWING_CREATED',
  QUOTE_CREATED = 'QUOTE_CREATED',
  QUOTE_DELETED = 'QUOTE_DELETED',
  SHARE_CREATED = 'SHARE_CREATED',
  SHARE_DELETED = 'SHARE_DELETED',
  GENERATE_POST_BEAUTIFUL = 'GENERATE_POST_BEAUTIFUL',
  GENERATE_CAPTION_MD = 'GENERATE_CAPTION_MD',
  GENERATE_IMAGE = 'GENERATE_IMAGE',
}

export const InteractionType = {
  HIDE: 'HIDE',
  SAVE: 'SAVE',
} as const;

export type InteractionType = (typeof InteractionType)[keyof typeof InteractionType];

export enum PostMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  HLS = 'HLS',
  VOICE = 'VOICE',
  GIF = 'GIF',
  OTHER = 'OTHER',
}

export enum PostMediaStatus {
  TEMPORARY = 'TEMPORARY',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

export enum NotificationType {
  POST = 'POST',
  LIKE = 'LIKE',
  FOLLOW = 'FOLLOW',
  QUOTE = 'QUOTE',
  SHARE = 'SHARE',
  REPLY = 'REPLY',
  MENTION = 'MENTION',
  INVITATION = 'INVITATION',
}

export enum NotificationTargetType {
  POST = 'POST',
  RESENT_INVITATION = 'RESENT_INVITATION',
  ADMIN_INVITATION = 'ADMIN_INVITATION',
}
