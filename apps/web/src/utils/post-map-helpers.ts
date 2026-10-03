import { formatTimeHourMinute } from "@/utils/format-time";

const VIDEO_EXTENSIONS = [
  ".mp4",
  ".webm",
  ".ogg",
  ".mov",
  ".m4v",
  ".3gp",
  ".m3u8",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isVideoUrl = (url: string) => {
  const urlWithoutQuery = url.split("?")[0].toLowerCase();

  return (
    VIDEO_EXTENSIONS.some((extension) =>
      urlWithoutQuery.endsWith(extension),
    ) ||
    url.includes("video") ||
    url.includes("stream.mux.com")
  );
};

const getMediaUrl = (media: unknown) => {
  if (typeof media === "string") return media;
  if (!isRecord(media) || typeof media.url !== "string") return "";
  return media.url;
};

export const mapMediaUrls = (media: unknown) =>
  Array.isArray(media) ? media.map(getMediaUrl).filter(Boolean) : [];

export const mapMedias = (media: unknown) => {
  if (!Array.isArray(media)) return [];

  return media.map((item) => {
    const mediaItem = isRecord(item) ? item : {};
    const url = getMediaUrl(item);
    const isVideo = mediaItem.type === "VIDEO" || isVideoUrl(url);

    return {
      id: mediaItem.id ?? null,
      url,
      type: mediaItem.type ?? (isVideo ? "VIDEO" : "IMAGE"),
      width: mediaItem.width ?? null,
      height: mediaItem.height ?? null,
      status: mediaItem.status ?? "READY",
    };
  });
};

export const mapMentions = (mentions: unknown) => {
  if (!Array.isArray(mentions)) return [];

  return mentions
    .map((item) => {
      const mention = isRecord(item) ? item : {};
      const user = isRecord(mention.user) ? mention.user : {};
      const userId = typeof mention.userId === "string" ? mention.userId : "";
      const userName =
        [mention.userName, mention.username, user.username].find(
          (value): value is string => typeof value === "string",
        ) ?? "";

      return { userId, userName };
    })
    .filter(({ userId, userName }) => Boolean(userId || userName));
};

export const getRawTopics = (post: {
  topics?: unknown;
  topicsPosts?: unknown;
}): unknown => {
  if (post.topics !== undefined && post.topics !== null) return post.topics;
  if (!Array.isArray(post.topicsPosts)) return [];

  return post.topicsPosts.map((item: unknown) => {
    const topicPost = isRecord(item) ? item : {};
    const topic = isRecord(topicPost.topic) ? topicPost.topic : {};
    return topic.name;
  });
};

export const mapTopics = (topics: unknown) =>
  Array.isArray(topics)
    ? topics
        .map((topic) => (typeof topic === "string" ? topic.trim() : ""))
        .filter(Boolean)
    : [];

export const formatScheduledTime = (value: unknown) => {
  if (typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return value;
  }
  if (typeof value !== "string" && !(value instanceof Date)) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : formatTimeHourMinute(date);
};
