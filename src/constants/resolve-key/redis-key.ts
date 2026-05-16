import type { PostType } from "@prisma/client";

const BLOOM_FILTER = {
  USERNAMES: "filter:usernames",
  EMAILS: "filter:emails",
} as const;

const ACCESS_TOKEN_BLACKLIST_PREFIX = "bl:at:";
const USER_PERMISSION_CACHE_PREFIX = "user:";
const USER_PERMISSION_CACHE_SUFFIX = ":permission";
const POST_PREFIX = "post:";
const POST_LIKES_SUFFIX = ":likes";
const POST_LIKE_COUNT_SUFFIX = ":likeCount";
const LIKE_SYNC_INIT_LOCK = "like:sync:init:lock";
const USER_POST_INTERACTION_PREFIX = "user:";
const USER_POST_INTERACTION_POST_SEGMENT = ":post:";

export type RedisPostInteractionType = Lowercase<Exclude<PostType, "POST">>;
export type RedisInteractionType = "like" | RedisPostInteractionType;

const buildUserPostInteractionKey = (
  userId: string,
  postId: string,
  type: RedisInteractionType,
) =>
  `${USER_POST_INTERACTION_PREFIX}${userId}${USER_POST_INTERACTION_POST_SEGMENT}${postId}:${type}`;

export const redisKey = {
  bloom: {
    usernames: () => BLOOM_FILTER.USERNAMES,
    emails: () => BLOOM_FILTER.EMAILS,
  },
  auth: {
    accessTokenBlacklist: (token: string) =>
      `${ACCESS_TOKEN_BLACKLIST_PREFIX}${token}`,
  },
  accessControl: {
    userPermission: (userId: string) =>
      `${USER_PERMISSION_CACHE_PREFIX}${userId}${USER_PERMISSION_CACHE_SUFFIX}`,
  },
  post: {
    likesSet: (publicId: string) => `${POST_PREFIX}${publicId}${POST_LIKES_SUFFIX}`,
    likeCount: (publicId: string) =>
      `${POST_PREFIX}${publicId}${POST_LIKE_COUNT_SUFFIX}`,
  },
  interaction: {
    userPost: (userId: string, postId: string, type: RedisInteractionType) =>
      buildUserPostInteractionKey(userId, postId, type),
    like: (userId: string, postId: string) =>
      buildUserPostInteractionKey(userId, postId, "like"),
    reply: (userId: string, postId: string) =>
      buildUserPostInteractionKey(userId, postId, "reply"),
    quote: (userId: string, postId: string) =>
      buildUserPostInteractionKey(userId, postId, "quote"),
    repost: (userId: string, postId: string) =>
      buildUserPostInteractionKey(userId, postId, "repost"),
  },
  job: {
    likeSyncInitLock: () => LIKE_SYNC_INIT_LOCK,
  },
} as const;
