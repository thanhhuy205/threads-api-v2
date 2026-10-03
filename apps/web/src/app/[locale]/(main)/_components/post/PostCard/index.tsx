import { AlertTriangle, CalendarClock, Ellipsis, Repeat2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AvatarGroup, {
  getAvatarGroupSizeClassName,
} from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import UserPreviewCard from "@/app/[locale]/(main)/_components/user/UserPreviewCard";
import { useAuth } from "@/features/auth/hooks";
import { POST_MODE_STYLES, type PostModeKey } from "@/features/post/constant";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/utils";
import { ReplyPermission, VisibilityPost } from "@/types/post";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import InteractionBar from "../InteractionBar";
import Menu from "../Menu";
import MenuMe from "../MenuMe";
import PostProvider from "../PostContext";
import Quote from "../QuotePost";
import type { MappedPost } from "../type";
const PostMediaCarousel = dynamic(() => import("./PostMediaCarousel"), {
  ssr: false,
  loading: () => <div className="mt-2 h-40 rounded-lg bg-muted/20" />,
});

const TYPE_STYLES: Record<string, { badgeBg: string; badgeText: string; text: string }> = {
  ANNOUNCEMENT: { badgeBg: "bg-red-50 dark:bg-red-950/40", badgeText: "text-red-600 dark:text-red-400", text: "Thông báo chính thức" },
  DISCUSSION: { badgeBg: "bg-emerald-50 dark:bg-emerald-950/40", badgeText: "text-emerald-700 dark:text-emerald-400", text: "Thảo luận" },
  KNOWLEDGE: { badgeBg: "bg-blue-50 dark:bg-blue-950/40", badgeText: "text-blue-700 dark:text-blue-400", text: "Kiến thức" },
  QUESTION: { badgeBg: "bg-amber-50 dark:bg-amber-950/40", badgeText: "text-amber-700 dark:text-amber-400", text: "Câu hỏi" },
  FEEDBACK: { badgeBg: "bg-cyan-50 dark:bg-cyan-950/40", badgeText: "text-cyan-700 dark:text-cyan-400", text: "Phản hồi" },
  INCIDENT_UPDATE: { badgeBg: "bg-red-50 dark:bg-red-950/40", badgeText: "text-red-700 dark:text-red-400", text: "Cập nhật sự cố" },
  INCIDENT: { badgeBg: "bg-red-50 dark:bg-red-950/40", badgeText: "text-red-700 dark:text-red-400", text: "Sự cố" },
};

const FEED_TYPE_STYLES: Record<string, { className: string; text: string }> = {
  ANNOUNCEMENT: {
    className: "bg-primary text-primary-foreground",
    text: "Thông báo chính thức",
  },
  DISCUSSION: {
    className: "bg-muted text-muted-foreground",
    text: "Thảo luận",
  },
  KNOWLEDGE: {
    className: "border border-foreground bg-transparent text-foreground",
    text: "Kiến thức",
  },
  QUESTION: {
    className: "border border-border bg-card text-foreground",
    text: "Câu hỏi",
  },
  FEEDBACK: {
    className: "bg-muted text-muted-foreground",
    text: "Phản hồi",
  },
  INCIDENT_UPDATE: {
    className: "bg-destructive text-destructive-foreground",
    text: "Cập nhật sự cố",
  },
  INCIDENT: {
    className: "bg-destructive text-destructive-foreground",
    text: "Sự cố",
  },
};

const PostCard = ({
  post,
  onClick,
  mode = "default",
  presentation = "standard",
}: {
  post: MappedPost;
  onClick?: () => void;
  mode?: PostModeKey;
  presentation?: "standard" | "feed";
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const isStaticOrReply = mode === "static" || mode === "reply";
  const modeConfig = POST_MODE_STYLES[mode];
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragGuardRef = useRef({ startX: 0, startY: 0, moved: false });
  const { user } = useAuth();
  const now = useNow(
    60_000,
    Boolean(post.dateRangeFrom || post.dateRangeTo),
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setIsClamped(element.scrollHeight > element.clientHeight);
    });
    resizeObserver.observe(element);

    setIsClamped(element.scrollHeight > element.clientHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, [post.content]);

  const username = post.user?.username ?? "";
  const isCurrentPostAuthor = username === user?.username;
  const time = post.createdAt;
  const formatScheduleDate = (value?: string | null) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);
  };
  const formatScheduleTime = (value?: string | null) => {
    if (!value) return "";
    if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) return value;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);
  };
  const scheduleFrom = [
    formatScheduleDate(post.dateRangeFrom),
    formatScheduleTime(post.scheduledTimeFrom),
  ]
    .filter(Boolean)
    .join(" ");
  const scheduleTo = [
    formatScheduleDate(post.dateRangeTo),
    formatScheduleTime(post.scheduledTimeTo),
  ]
    .filter(Boolean)
    .join(" ");
  const hasSchedule = Boolean(scheduleFrom || scheduleTo);
  const visibilityLabelMap: Record<VisibilityPost, string> = {
    WORKSPACE: t("post.visibilityCompany"),
    PUBLIC: t("post.visibilityCompany"),
    FRIEND: t("post.visibilityTeam"),
    PRIVATE: t("post.visibilityMentioned"),
  };
  const replyPermissionLabelMap: Record<ReplyPermission, string> = {
    EVERYONE: t("post.replyAudienceEveryone"),
    FOLLOWERS: t("post.replyAudienceFollowers"),
    FOLLOWING: t("post.replyAudienceFollowing"),
    MENTIONED: t("post.replyAudienceMentioned"),
  };

  const visibilityLabel =
    visibilityLabelMap[post.visibility as VisibilityPost] ?? post.visibility;
  const shouldShowVisibilityBadge = post.visibility !== VisibilityPost.PUBLIC;
  const replyPermissionLabel =
    replyPermissionLabelMap[post.replyPermission as ReplyPermission] ??
    post.replyPermission;
  const badgeClassName =
    mode === "default"
      ? "size-5 -right-0.5 -bottom-0.5"
      : "size-4 -right-px -bottom-px bg-primary";

  const handleMouseEnter = useCallback(() => {
    if (isStaticOrReply) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(true), 300);
  }, [isStaticOrReply]);

  const handleMouseLeave = useCallback(() => {
    if (isStaticOrReply) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpen(false);
  }, [isStaticOrReply]);

  const MenuButton = useMemo(() => {
    if (isStaticOrReply) return null;

    const icon = (
      <Ellipsis className="w-5 h-5 cursor-pointer hover:bg-background" />
    );
    return isCurrentPostAuthor ? (
      <MenuMe
        threadId={post.id}
        isSaved={post.isSavedByAuth}
        buttonActive={icon}
      />
    ) : (
      <Menu
        username={username}
        userId={post.user?.id ?? 0}
        postId={post.id}
        isSaved={post.isSavedByAuth}
        isHidden={post.isHiddenByAuth}
        buttonActive={icon}
      />
    );
  }, [
    isCurrentPostAuthor,
    isStaticOrReply,
    username,
    post.id,
    post.user?.id,
    post.isSavedByAuth,
    post.isHiddenByAuth,
  ]);

  const mentionUsernameMap = useMemo(() => {
    const map = new Map<string, string>();

    (post.mentions ?? []).forEach(
      (mention: { userId: string; userName: string }) => {
        const rawUsername = mention?.userName;
        if (typeof rawUsername !== "string") return;

        const normalized = rawUsername.trim();
        if (!normalized) return;

        map.set(normalized.toLowerCase(), normalized);
      },
    );

    return map;
  }, [post.mentions]);

  const parsedContent = useMemo(() => {
    const content = post.content ?? "";
    if (!content) return null;

    const result: React.ReactNode[] = [];
    const mentionRegex = /@([\p{L}\p{N}_-]{1,32})/gu;
    const hasMentionData = mentionUsernameMap.size > 0;
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = mentionRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const matchedUsername = match[1];
      const startIndex = match.index;
      const endIndex = startIndex + fullMatch.length;

      if (startIndex > cursor) {
        result.push(content.slice(cursor, startIndex));
      }

      const mentionFromDb = mentionUsernameMap.get(
        matchedUsername.toLowerCase(),
      );
      const canLinkMention = !hasMentionData || Boolean(mentionFromDb);
      const targetUsername = mentionFromDb ?? matchedUsername;

      if (canLinkMention) {
        result.push(
          <Link
            key={`${startIndex}-${targetUsername}`}
            href={`/${targetUsername}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-blue-600 hover:underline"
          >
            @{targetUsername}
          </Link>,
        );
      } else {
        result.push(fullMatch);
      }

      cursor = endIndex;
    }

    if (cursor < content.length) {
      result.push(content.slice(cursor));
    }

    return result;
  }, [mentionUsernameMap, post.content]);

  const topics = useMemo(() => {
    const rawTopics = Array.isArray(post.topics) ? post.topics : [];

    return rawTopics
      .map((topic: unknown) =>
        typeof topic === "string" ? topic.trim().replace(/^#+/, "").trim() : "",
      )
      .filter(Boolean);
  }, [post.topics]);

  const primaryTopic = topics[0] ?? "";

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragGuardRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragGuardRef.current.moved) return;

    const dx = Math.abs(e.clientX - dragGuardRef.current.startX);
    const dy = Math.abs(e.clientY - dragGuardRef.current.startY);

    if (dx > 6 || dy > 6) {
      dragGuardRef.current.moved = true;
    }
  };

  const handleCardClick = () => {
    if (isStaticOrReply || !onClick) return;

    if (dragGuardRef.current.moved) {
      dragGuardRef.current.moved = false;
      return;
    }

    const selectedText = window.getSelection?.()?.toString().trim();
    if (selectedText) return;

    onClick();
  };

  const typeStyle = post.type ? TYPE_STYLES[post.type] : null;
  const isTypeCard = !!typeStyle && (mode === "default" || mode === "detail" || mode === "profile");
  const feedTypeStyle = post.type ? FEED_TYPE_STYLES[post.type] : null;

  const scheduleTimeline = useMemo(() => {
    const toTimestamp = (dateValue?: string | null, timeValue?: string | null) => {
      if (!dateValue) return null;
      const parsed = new Date(dateValue);
      if (Number.isNaN(parsed.getTime())) return null;

      const timeMatch = timeValue?.match(/^(\d{2}):(\d{2})$/);
      if (timeMatch) {
        parsed.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
      }

      return parsed.getTime();
    };

    const start = toTimestamp(post.dateRangeFrom, post.scheduledTimeFrom);
    const end = toTimestamp(post.dateRangeTo, post.scheduledTimeTo);
    const currentTime = now ?? 0;
    const progress =
      now !== null && start !== null && end !== null && end > start
        ? Math.min(100, Math.max(0, ((currentTime - start) / (end - start)) * 100))
        : 0;

    let status = "Đã lên lịch";
    if (now !== null && start !== null && currentTime < start) {
      status = "Sắp diễn ra";
    } else if (now !== null && end !== null && currentTime > end) {
      status = "Đã kết thúc";
    } else if (now !== null && end !== null) {
      const daysLeft = Math.max(1, Math.ceil((end - currentTime) / 86_400_000));
      status = `Còn ${daysLeft} ngày`;
    }

    return { progress, status };
  }, [
    post.dateRangeFrom,
    post.dateRangeTo,
    post.scheduledTimeFrom,
    post.scheduledTimeTo,
    now,
  ]);

  if (presentation === "feed") {
    return (
      <article
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onClick={handleCardClick}
        className="border-b border-border px-5 pb-3.5 pt-4 transition-colors hover:bg-card/45"
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        <header className="flex items-start gap-2.5">
          <div className="size-8 shrink-0 overflow-hidden rounded-full">
            <AvatarGroup
              className="h-full w-full"
              size={8}
              url={post.user?.avatarUrl ?? ""}
              fallBack={username.slice(0, 2).toUpperCase()}
            />
          </div>

          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(`/${username}`);
                }}
                className="truncate text-sm font-bold text-foreground hover:underline"
              >
                {username}
              </button>
              {post.user?.verified && (
                <span className="flex size-3 items-center justify-center rounded-full bg-foreground text-[8px] font-bold text-background">
                  ✓
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {feedTypeStyle && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-[10.5px] font-semibold leading-none",
                    feedTypeStyle.className,
                  )}
                >
                  {feedTypeStyle.text}
                </span>
              )}

              {primaryTopic && (
                <span className="font-medium text-foreground">{primaryTopic}</span>
              )}

              {(feedTypeStyle || primaryTopic) && (
                <span className="size-0.5 rounded-full bg-muted-foreground" />
              )}

              {shouldShowVisibilityBadge && !primaryTopic && (
                <>
                  <span>{visibilityLabel}</span>
                  <span className="size-0.5 rounded-full bg-muted-foreground" />
                </>
              )}
              <span>{time}</span>
            </div>

            {!isStaticOrReply && open && post.user && (
              <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <UserPreviewCard user={post.user} />
              </div>
            )}
          </div>

          <div className="mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-4">
            {MenuButton}
          </div>
        </header>

        {post.isDisinformation && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/50 px-3 py-2 text-[11px] text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            <AlertTriangle className="size-4 shrink-0 text-red-500" />
            <div className="font-semibold leading-normal">
              Cảnh báo: Bài viết này chứa thông tin chưa được kiểm chứng hoặc tin giả.
            </div>
          </div>
        )}

        {post.content && (
          <div className="relative mb-3 mt-[11px] text-[14.5px] leading-[1.55]">
            <p
              ref={textRef}
              className="break-words whitespace-pre-wrap text-foreground"
              style={
                !isExpanded
                  ? {
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }
                  : undefined
              }
            >
              {parsedContent}
            </p>
            {(isClamped || isExpanded) && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsExpanded((previous) => !previous);
                }}
                className="mt-1 block text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        )}

        {hasSchedule && (
          <div className="mb-1 mt-3 rounded-lg border border-border bg-card px-3.5 py-3">
            <div className="mb-2.5 flex items-baseline justify-between font-mono text-[10.5px]">
              <span className="uppercase tracking-[0.06em] text-muted-foreground">
                Thời hạn
              </span>
              <span className="font-semibold text-destructive">
                {scheduleTimeline.status}
              </span>
            </div>
            <div className="relative h-[5px] rounded-full bg-input">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${scheduleTimeline.progress}%` }}
              />
              <span
                className="absolute top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-destructive"
                style={{ left: `${scheduleTimeline.progress}%` }}
              />
            </div>
            <div className="mt-2.5 flex justify-between gap-3 font-mono text-[11px] text-muted-foreground">
              <span>{scheduleFrom ? `Bắt đầu ${scheduleFrom}` : ""}</span>
              <span className="text-right">{scheduleTo ? `Kết thúc ${scheduleTo}` : ""}</span>
            </div>
          </div>
        )}

        {post.mediaUrls.length > 0 && (
          <PostMediaCarousel
            presentation="feed"
            imageOffset=""
            isStaticOrReply={isStaticOrReply}
            mediaHeight={120}
            mediaUrls={post.mediaUrls}
            mediaWidth={260}
            medias={post.medias}
          />
        )}

        {post.originalPost && (
          <div className="mt-3">
            <Quote mode="default" post={post.originalPost} />
          </div>
        )}

        <PostProvider post={post}>
          <InteractionBar variant="feed" className="mt-3" mode="auto" size={15} />
        </PostProvider>
      </article>
    );
  }

  return (
    <div
      className={cn(
        modeConfig.wrapper,
        isTypeCard && "!rounded-xl",
      )}
      style={{
        cursor: modeConfig.cursor as React.CSSProperties["cursor"],
      }}
    >
      {mode === "repost" && (
        <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs">
          <Repeat2 className="w-4 h-4" />
          <span className="font-medium">{user?.username} đã đăng lại</span>
        </div>
      )}

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onClick={handleCardClick}
        className={cn("grid w-full", isTypeCard ? "flex flex-col gap-2" : modeConfig.grid)}
      >
        {isTypeCard ? (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap items-center gap-2">
                <div className="size-10 shrink-0 rounded-full overflow-hidden">
                  <AvatarGroup
                    className="w-full h-full"
                    size={10}
                    url={post.user?.avatarUrl ?? ""}
                    fallBack={username.slice(0, 2).toUpperCase()}
                  />
                </div>

                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="relative inline-flex min-w-0"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      router.push(`/${username}`);
                      e.stopPropagation();
                    }}
                    className={`font-semibold text-foreground truncate whitespace-nowrap hover:underline ${modeConfig.usernameText}`}
                  >
                    {username}
                  </button>
                </div>

                <span className={`text-muted-foreground whitespace-nowrap ${modeConfig.timeText}`}>
                  • {time}
                </span>

                <span className={cn("rounded-md border border-current/15 px-2 py-0.5 text-[10px] font-semibold", typeStyle?.badgeBg, typeStyle?.badgeText)}>
                  {typeStyle?.text}
                </span>
              </div>
              {MenuButton}
            </div>

            <div className="min-w-0 flex flex-col pt-1">
              {post.content && (
                <div className="relative">
                  <p
                    ref={textRef}
                    className={cn(
                      "text-foreground/90 leading-relaxed break-words whitespace-pre-wrap",
                      modeConfig.contentText,
                      !isExpanded && "line-clamp-[5]",
                    )}
                    style={
                      !isExpanded
                        ? {
                            display: "-webkit-box",
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }
                        : undefined
                    }
                  >
                    {parsedContent}
                  </p>
                  {(isClamped || isExpanded) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded((prev) => !prev);
                      }}
                      className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none block"
                    >
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              className={cn(
            "relative my-auto",
            getAvatarGroupSizeClassName(modeConfig.avatarSize),
          )}
        >
          <AvatarGroup
            className="w-full h-full"
            size={modeConfig.avatarSize}
            url={post.user?.avatarUrl ?? ""}
            fallBack={username.slice(0, 2).toUpperCase()}
          />
          {(mode === "default" || mode === "comment") && (
            <div
              className={cn(
                "absolute rounded-full flex items-center justify-center border-2 border-white",
                badgeClassName,
                "bg-black",
              )}
            >
              <span
                className={cn(
                  "text-white font-semibold text-center",
                  mode === "default" ? "text-[15px]" : "text-[9px]",
                )}
              >
                +
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex flex-col">
          <div className="grid grid-cols-[1fr_max-content] gap-1.5 items-center">
            <div className="flex flex-wrap items-center min-w-0 gap-2">
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  "relative inline-flex min-w-0",
                  !isStaticOrReply &&
                    "after:absolute after:left-1/2 after:top-full after:h-4 after:w-[320px] after:-translate-x-1/2 after:bg-transparent after:content-['']",
                  open
                    ? "after:pointer-events-auto"
                    : "after:pointer-events-none",
                )}
              >
                <span
                  onClick={(e) => {
                    router.push(`/${username}`);
                    e.stopPropagation();
                  }}
                  className={`font-semibold text-foreground truncate whitespace-nowrap ${
                    isStaticOrReply ? "" : "hover:underline"
                  } ${modeConfig.usernameText}`}
                >
                  {username}
                </span>

                {!isStaticOrReply && open && post.user && (
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <UserPreviewCard
                      user={post.user}
                    />
                  </div>
                )}
              </div>

              {post.user?.verified && (
                <svg
                  aria-label="Đã xác minh"
                  role="img"
                  viewBox="0 0 40 40"
                  style={{
                    fill: "rgb(0, 149, 246)",
                    height:
                      modeConfig.usernameText === "text-xs" ? "10px" : "12px",
                    width:
                      modeConfig.usernameText === "text-xs" ? "10px" : "12px",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Đã xác minh</title>
                  <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" />
                </svg>
              )}

              {primaryTopic && (
                <>
                  <span
                    className={`text-muted-foreground whitespace-nowrap ${modeConfig.timeText}`}
                  >
                    &gt;
                  </span>
                  <span
                    className={`font-semibold text-foreground whitespace-nowrap ${modeConfig.timeText}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {primaryTopic}
                  </span>
                </>
              )}

              <span
                className={`text-muted-foreground whitespace-nowrap ${modeConfig.timeText}`}
              >
                {time}
              </span>

              {shouldShowVisibilityBadge && (
                <span className="inline-flex items-center rounded-full border border-black bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
                  {visibilityLabel}
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-black/40 bg-white px-2 py-0.5 text-[10px] font-medium text-black">
                {replyPermissionLabel}
              </span>
            </div>

            {MenuButton}
          </div>

          {post.isDisinformation && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/50 px-3 py-2 text-[11px] text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 mt-2">
              <AlertTriangle className="size-4 shrink-0 text-red-500" />
              <div className="font-semibold leading-normal">
                Cảnh báo: Bài viết này chứa thông tin chưa được kiểm chứng hoặc
                tin giả.
              </div>
            </div>
          )}

          {post.content && (
            <div className="relative mt-1">
              <p
                ref={textRef}
                className={cn(
                  "text-foreground leading-relaxed break-words whitespace-pre-wrap",
                  modeConfig.contentText,
                  !isExpanded && "line-clamp-[5]",
                )}
                style={
                  !isExpanded
                    ? {
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }
                    : undefined
                }
              >
                {parsedContent}
              </p>
              {(isClamped || isExpanded) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded((prev) => !prev);
                  }}
                  className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none block"
                >
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </div>
          )}
        </div>
        </>
      )}
    </div>

      {hasSchedule && (
        <div
          className={cn(
            "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground",
            !isTypeCard && modeConfig.contentOffset,
          )}
        >
          <CalendarClock className="size-4 shrink-0" />
          {scheduleFrom && (
            <span>
              <span className="font-medium text-foreground">
                {t("post.scheduleStart")}:
              </span>{" "}
              {scheduleFrom}
            </span>
          )}
          {scheduleTo && (
            <span>
              <span className="font-medium text-foreground">
                {t("post.scheduleEnd")}:
              </span>{" "}
              {scheduleTo}
            </span>
          )}
        </div>
      )}

      {post.mediaUrls.length > 0 && (
        <PostMediaCarousel
          imageOffset={modeConfig.imageOffset}
          isStaticOrReply={isStaticOrReply}
          mediaHeight={modeConfig.mediaHeight}
          mediaUrls={post.mediaUrls}
          mediaWidth={modeConfig.mediaWidth}
          medias={post.medias}
        />
      )}


      {post.originalPost && (
        <Quote
          mode={
            mode === "static"
              ? "static"
              : mode === "detail"
                ? "detail"
                : "default"
          }
          post={post.originalPost}
        />
      )}

      <div className={isTypeCard ? "mt-3" : modeConfig.contentOffset}>
        <PostProvider post={post}>
          {modeConfig.interactionMode !== "hidden" && (
            <InteractionBar
              className={mode === "detail" ? "ml-0" : ""}
              mode={modeConfig.interactionMode}
              size={modeConfig.interactionSize}
            />
          )}
        </PostProvider>
      </div>
    </div>
  );
};

export default PostCard;
