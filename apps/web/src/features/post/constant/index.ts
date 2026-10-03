export type PostModeKey =
  | "default"
  | "repost"
  | "static"
  | "detail"
  | "comment"
  | "reply"
  | "profile";

type InteractionMode = "auto" | "share" | "comment" | "hidden";

type PostModeStyle = {
  wrapper: string;
  cursor: string;
  grid: string;
  avatarSize: number;
  usernameText: string;
  contentText: string;
  timeText: string;
  imageOffset: string;
  contentOffset: string;
  mediaWidth: number;
  mediaHeight: number;
  interactionMode: InteractionMode;
  interactionSize: number;
};

export const POST_MODE_STYLES: Record<PostModeKey, PostModeStyle> = {
  default: {
    wrapper: "border border-border rounded-xl bg-background shadow-sm px-5 py-4 mb-3 mx-3",
    cursor: "pointer",
    grid: "grid-cols-[44px_minmax(0,1fr)] gap-3",
    avatarSize: 10,
    usernameText: "text-sm",
    contentText: "text-sm",
    timeText: "text-xs",
    imageOffset: "ml-3 pl-12",
    contentOffset: "mt-3 pl-[54px]",
    mediaWidth: 210,
    mediaHeight: 280,
    interactionMode: "auto",
    interactionSize: 18,
  },
  repost: {
    wrapper: "border border-border rounded-xl bg-background shadow-sm px-5 py-4 mb-3 mx-3",
    cursor: "pointer",
    grid: "grid-cols-[44px_minmax(0,1fr)] gap-3",
    avatarSize: 10,
    usernameText: "text-sm",
    contentText: "text-sm",
    timeText: "text-xs",
    imageOffset: "ml-3 pl-12",
    contentOffset: "mt-3 pl-[54px]",
    mediaWidth: 210,
    mediaHeight: 280,
    interactionMode: "auto",
    interactionSize: 18,
  },
  detail: {
    wrapper: "px-4",
    cursor: "",
    grid: "grid-cols-[48px_minmax(0,1fr)] gap-3",
    avatarSize: 10,
    usernameText: "text-sm",
    contentText: "text-sm",
    timeText: "text-xs",
    imageOffset: "ml-3 pl-2",
    contentOffset: "mt-3 pl-2",
    mediaWidth: 210,
    mediaHeight: 280,
    interactionMode: "auto",
    interactionSize: 18,
  },
  comment: {
    wrapper: "border border-border rounded-xl bg-background shadow-sm px-4 py-3 mb-3 mx-3",
    cursor: "pointer",
    grid: "grid-cols-[36px_minmax(0,1fr)] gap-2",
    avatarSize: 8,
    usernameText: "text-sm",
    contentText: "text-sm",
    timeText: "text-[10px]",
    imageOffset: "ml-1 pl-8",
    contentOffset: "mt-2 pl-5",
    mediaWidth: 150,
    mediaHeight: 200,
    interactionMode: "comment",
    interactionSize: 20,
  },
  static: {
    wrapper: "",
    cursor: "default",
    grid: "grid-cols-[48px_minmax(0,1fr)] gap-3",
    avatarSize: 10,
    usernameText: "text-sm",
    contentText: "text-sm",
    timeText: "text-xs",
    imageOffset: "",
    contentOffset: "",
    mediaWidth: 210,
    mediaHeight: 280,
    interactionMode: "share",
    interactionSize: 18,
  },
  reply: {
    wrapper: "px-0 py-0",
    cursor: "default",
    grid: "grid-cols-[32px_minmax(0,1fr)] gap-5",
    avatarSize: 10,
    usernameText: "text-sm",
    contentText: "text-sm",
    timeText: "text-[10px]",
    imageOffset: "ml-0 pl-0",
    contentOffset: "mt-2",
    mediaWidth: 180,
    mediaHeight: 220,
    interactionMode: "hidden",
    interactionSize: 0,
  },
  profile: {
    wrapper: "border border-border rounded-xl bg-background shadow-sm px-5 py-4 mb-3 mx-3",
    cursor: "pointer",
    grid: "grid-cols-[44px_minmax(0,1fr)] gap-3",
    avatarSize: 10,
    usernameText: "text-sm",
    contentText: "text-sm",
    timeText: "text-xs",
    imageOffset: "ml-3 pl-12",
    contentOffset: "mt-3 pl-[54px]",
    mediaWidth: 210,
    mediaHeight: 280,
    interactionMode: "auto",
    interactionSize: 18,
  },
};

export * from "./public-api";

