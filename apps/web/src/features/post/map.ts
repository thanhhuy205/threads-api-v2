import { ReplyPermission, VisibilityPost } from "@/types/post";
import { formatTime } from "@/utils/format-time";
import {
  formatScheduledTime,
  getRawTopics,
  mapMediaUrls,
  mapMedias,
  mapMentions,
  mapTopics,
} from "@/utils/post-map-helpers";

// API responses have multiple legacy shapes; normalize them at this boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapPost = (post: any): any => {
  const formatDisplayTime = (value?: string | null) =>
    value ? formatTime(value) : "";

  const rawUser = post.userSnapshot ?? post.user ?? null;
  const rawOriginalPost =
    post.originalPost ?? post.original_post ?? post.origin ?? null;
  const rawMedia = post.mediaUrls ?? post.media_urls ?? post.media ?? [];
  const rawTopics = getRawTopics(post);

  const mappedUser = rawUser
    ? {
      id: rawUser.id,
      name: rawUser.name ?? rawUser.username ?? "Unknown User",
      username: rawUser.username ?? "unknown",
      bio: rawUser.bio ?? "",
      isPrivate: rawUser.isPrivate ?? false,
      verified: !!rawUser.verifiedAt,
      createdAt: formatDisplayTime(rawUser.createdAt),
      updatedAt: rawUser.updatedAt ?? null,
      avatarUrl: rawUser.avatar ?? rawUser.avatarUrl ?? "",
    }
    : {
      id: "unknown",
      name: "Unknown User",
      username: "unknown",
      bio: "",
      isPrivate: false,
      verified: false,
      createdAt: formatDisplayTime(post.createdAt),
      updatedAt: null,
      avatarUrl: "",
    };

  return {
    id: post.publicId ?? post.id,
    publicId: post.publicId ?? post.id,
    userId: post.userId ?? null,
    type: post.type ?? "",
    content: post.content ?? "",
    parentId: post.parentId ?? null,
    originalPostId: post.originPostId ?? null,
    parent: post.parent ? mapPost(post.parent) : null,
    rootPostId: post.rootPostId ?? null,
    user: mappedUser,
    replyPermission: post.replyPermission ?? ReplyPermission.EVERYONE,
    visibility: post.visibility ?? VisibilityPost.PUBLIC,
    likesCount: post.likesCount ?? post.likeCount ?? 0,
    repliesCount: post.repliesCount ?? 0,
    repostsCountAndQuoteCount: post.repostsCountAndQuoteCount ?? 0,
    viewsCount: post.viewsCount ?? 0,
    createdAt: formatDisplayTime(post.createdAt),
    dateRangeFrom: post.dateRangeFrom ?? null,
    dateRangeTo: post.dateRangeTo ?? null,
    scheduledTimeFrom: formatScheduledTime(post.scheduledTimeFrom),
    scheduledTimeTo: formatScheduledTime(post.scheduledTimeTo),
    mediaUrls: mapMediaUrls(rawMedia),
    medias: mapMedias(rawMedia),
    mentions: mapMentions(post.mentions),
    topics: mapTopics(rawTopics),
    isGhost: post.isGhost ?? false,
    isFollowingAuthor: post.isFollowingAuthor ?? false,
    isFollowedByAuthor: post.isFollowedByAuthor ?? false,
    ghostExpiresAt: post.ghostExpiresAt ?? null,
    topicId: post.topicId ?? null,
    isLikedByAuth: post.isLikedByAuth ?? false,
    isSavedByAuth: post.isSavedByAuth ?? false,
    isHiddenByAuth: post.isHiddenByAuth ?? false,
    isRepostByAuth: post.isRepostByAuth ?? false,
    requiresReplyApproval: post.requiresReplyApproval ?? false,
    status: post.status ?? (post.deletedAt ? "deleted" : "approved"),
    updatedAt: formatDisplayTime(post.updatedAt ?? post.createdAt),
    deletedAt: post.deletedAt ?? null,
    isDisinformation: !!post.isDisinformation,
    originalPost: rawOriginalPost ? mapPost(rawOriginalPost) : null,
  };
};
