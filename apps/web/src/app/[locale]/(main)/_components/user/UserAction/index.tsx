"use client";
import EmojiPortal from "@/app/[locale]/(main)/_components/common/EmojiPortal";
import { VerifiedIcon } from "@/app/[locale]/(main)/_components/common/Icon/VerifiedIcon";
import SwiperImage from "@/app/[locale]/(main)/_components/common/SwiperImage";
import ImagePost from "@/app/[locale]/(main)/_components/post/Icons/ImagePost";
import ImageSticker from "@/app/[locale]/(main)/_components/post/Icons/ImageSticker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useGetUserMentionsQuery } from "@/features/user/hooks";
import { useAction } from "@/hooks/use-action";
import { useDebounceSearch } from "@/hooks/use-debouce-search";
import {
  PostType,
  type MentionInput,
  type PostTypeStatus,
  type ScheduleDateRange,
} from "@/types/post";
import {
  BarChart3,
  CalendarClock,
  ChevronRight,
  Loader2,
  Megaphone,
  MessageSquare,
  Upload,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import CalendarWithTime from "./CalendarWithTime";
import InputSearchTopic from "./InputSearchTopic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <div className="h-[280px] w-[280px] rounded-lg bg-muted/40" />,
});

interface UserActionProps {
  username: string;
  onChangeContent?: (data: {
    content: string;
    previewImage: File[] | null;
    topic: string;
    mentions: MentionInput[];
    postType: PostTypeStatus;
    scheduledDate?: ScheduleDateRange;
    scheduledTimeFrom?: string;
    scheduledTimeTo?: string;
  }) => void;
}
const UserAction = ({ username, onChangeContent }: UserActionProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const {
    content,
    setContent,
    previewImage,
    handleInput,
    handleRemoveImage,
    inputRef,
    showEmoji,
    setShowEmoji,
  } = useAction();

  const emojiRef = useRef<SVGSVGElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });
  const [topic, setTopic] = useState("");
  const [mentions, setMentions] = useState<MentionInput[]>([]);
  const [postType, setPostType] = useState<PostTypeStatus>(
    PostType.POST,
  );
  const [scheduledDate, setScheduledDate] = useState<DateRange>();
  const [scheduledTimeFrom, setScheduledTimeFrom] = useState("09:00");
  const [scheduledTimeTo, setScheduledTimeTo] = useState("10:00");
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyOptions, setSurveyOptions] = useState(["", ""]);
  const scheduleDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [locale],
  );

  const mentionMatch = content.match(/(^|\s)@([\p{L}\p{N}_-]{1,32})$/u);
  const mentionQuery = mentionMatch?.[2] ?? "";
  const debouncedMentionQuery = useDebounceSearch({
    query: mentionQuery,
    delay: 500,
  }).trim();

  const { data: mentionData, isLoading: mentionLoading } =
    useGetUserMentionsQuery({
      query: { q: debouncedMentionQuery, take: 40 },
      options: { enabled: Boolean(debouncedMentionQuery) },
    });

  const usernamesInContent = useMemo(
    () =>
      new Set(
        Array.from(content.matchAll(/@([\p{L}\p{N}_-]{1,32})/gu)).map((item) =>
          item[1].toLowerCase(),
        ),
      ),
    [content],
  );

  const activeMentions = useMemo(
    () =>
      mentions.filter((item) =>
        usernamesInContent.has(item.username.toLowerCase()),
      ),
    [mentions, usernamesInContent],
  );

  const mentionCandidates = useMemo(() => {
    const rawItems = mentionData?.data ?? [];

    return rawItems
      .map((item) => {
        return {
          id: item.id,
          username: item.username,
          name: item.name,
          avatar: item.avatar,
          verifiedAt: item.verifiedAt,
        };
      })
      .filter((item) => Boolean(item.id) && Boolean(item.username));
  }, [mentionData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) &&
        emojiRef.current &&
        !emojiRef.current.contains(target)
      ) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji, setShowEmoji]);

  useEffect(() => {
    onChangeContent?.({
      content,
      previewImage,
      topic,
      mentions: activeMentions,
      postType,
      scheduledDate:
        postType === PostType.ANNOUNCEMENT && scheduledDate
        ? {
            from: scheduledDate.from?.toISOString(),
            to: scheduledDate.to?.toISOString(),
          }
        : undefined,
      scheduledTimeFrom:
        postType === PostType.ANNOUNCEMENT && scheduledDate?.from
          ? scheduledTimeFrom
          : undefined,
      scheduledTimeTo:
        postType === PostType.ANNOUNCEMENT && scheduledDate?.to
          ? scheduledTimeTo
          : undefined,
    });
  }, [
    activeMentions,
    content,
    previewImage,
    topic,
    onChangeContent,
    postType,
    scheduledDate,
    scheduledTimeFrom,
    scheduledTimeTo,
  ]);

  return (
    <>
      <div className="flex items-center gap-1 font-semibold text-sm leading-none mb-1">
        <span>{username || "None"}</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <InputSearchTopic onTopicChange={setTopic} />
      </div>

      <div className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("post.whatsNew")}
          className="min-h-[24px] border-none shadow-none resize-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground text-base md:text-sm leading-normal"
          rows={1}
        />
        {mentionQuery ? (
          <div className="max-h-44 overflow-y-auto rounded-md border bg-background p-1">
            {mentionLoading ? (
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Đang tìm người dùng...
              </div>
            ) : null}

            {!mentionLoading && mentionCandidates.length
              ? mentionCandidates.map((item) => (
                  <button
                    key={`${item.id}-${item.username}`}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent transition-colors"
                    onClick={() => {
                      setContent((prev) =>
                        prev.replace(
                          /(^|\s)@[\p{L}\p{N}_-]{1,32}$/u,
                          `$1@${item.username} `,
                        ),
                      );
                      setMentions((prev) => {
                        const next = [
                          ...prev.filter(
                            (mention) => mention.userId !== item.id,
                          ),
                          { userId: item.id, username: item.username },
                        ];
                        return next.slice(-5);
                      });
                    }}>
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src={item.avatar || undefined} />
                      <AvatarFallback>
                        {item.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground text-xs truncate">
                          {item.username}
                        </span>
                        {item.verifiedAt && (
                          <VerifiedIcon className="size-3.5 shrink-0 text-[#0095F6] fill-[#0095F6]" />
                        )}
                      </div>
                      {item.name && (
                        <span className="text-muted-foreground text-[11px] truncate mt-0.5">
                          {item.name}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              : null}

            {!mentionLoading && mentionCandidates.length === 0 ? (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                Không có gợi ý
              </div>
            ) : null}
          </div>
        ) : null}

        {previewImage?.length ? (
          <SwiperImage
            images={previewImage}
            onRemove={handleRemoveImage}
            sizeMode="natural"
          />
        ) : null}

        {showSurvey ? (
          <div className="space-y-2 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Tạo khảo sát</p>
              <button
                type="button"
                aria-label="Đóng khảo sát"
                onClick={() => setShowSurvey(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            {surveyOptions.map((option, index) => (
              <input
                key={index}
                value={option}
                onChange={(event) =>
                  setSurveyOptions((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? event.target.value : item,
                    ),
                  )
                }
                placeholder={`Lựa chọn ${index + 1}`}
                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
              />
            ))}
            {surveyOptions.length < 4 ? (
              <button
                type="button"
                onClick={() => setSurveyOptions((current) => [...current, ""])}
                className="text-xs font-medium text-primary hover:underline">
                + Thêm lựa chọn
              </button>
            ) : null}
          </div>
        ) : null}

        {postType === PostType.ANNOUNCEMENT && scheduledDate?.from ? (
          <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 px-3 py-2.5 text-xs">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-semibold text-foreground">
                Đã thêm thời hạn
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {t("post.scheduleStart")}:
                </span>{" "}
                {scheduleDateFormatter.format(scheduledDate.from)} {scheduledTimeFrom}
              </p>
              {scheduledDate.to ? (
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {t("post.scheduleEnd")}:
                  </span>{" "}
                  {scheduleDateFormatter.format(scheduledDate.to)} {scheduledTimeTo}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Chọn thêm ngày kết thúc
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Xóa thời hạn"
              onClick={() => setScheduledDate(undefined)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3 text-muted-foreground/60">
        <div title="Phương tiện">
          <input
            onChange={handleInput}
            ref={inputRef}
            multiple
            accept="image/*,video/*"
            type="file"
            className="hidden"
          />
          <ImagePost
            onClick={() => inputRef.current?.click()}
            className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          title="Tải file ảnh hoặc video"
          aria-label="Tải file ảnh hoặc video"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Upload className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowSurvey((current) => !current)}
          title="Tạo khảo sát"
          aria-label="Tạo khảo sát"
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <BarChart3 className="size-4" />
        </button>

        {/* {!showSurvey && (
          <div title="Giọng nói">
            <Mic className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
          </div>
        )} */}

        <div className="relative" title="Nhãn dán">
          <ImageSticker
            ref={emojiRef}
            className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => {
              if (emojiRef.current) {
                const rect = emojiRef.current.getBoundingClientRect();
                setIconPosition({ top: rect.top, left: rect.left });
              }
              setShowEmoji(!showEmoji);
            }}
          />

          {showEmoji && (
            <EmojiPortal>
              <div
                ref={pickerRef}
                className="absolute z-[50]"
                style={{
                  top: iconPosition.top - 10 + "px",
                  left: iconPosition.left + 20 + "px",
                }}>
                <EmojiPicker
                  searchDisabled
                  skinTonesDisabled
                  previewConfig={{ showPreview: false }}
                  categories={[]}
                  lazyLoadEmojis={true}
                  height={280}
                  width={280}
                  onEmojiClick={(emoji) => setContent(content + emoji.emoji)}
                />
              </div>
            </EmojiPortal>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="Loại bài viết"
              aria-label="Loại bài viết"
              className="inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
              <MessageSquare className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 rounded-xl p-1.5">
            <DropdownMenuRadioGroup
              value={postType}
              onValueChange={(value) => {
                const nextPostType = value as PostTypeStatus;
                setPostType(nextPostType);
                if (nextPostType !== PostType.ANNOUNCEMENT) {
                  setScheduledDate(undefined);
                }
              }}>
              <DropdownMenuRadioItem
                value={PostType.POST}
                className="gap-2 rounded-lg">
                <MessageSquare className="size-4" />
                Bài viết
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value={PostType.ANNOUNCEMENT}
                className="gap-2 rounded-lg">
                <Megaphone className="size-4" />
                Thông báo
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {postType === PostType.ANNOUNCEMENT ? <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="Đặt thời hạn bài viết"
              aria-label="Đặt thời hạn bài viết"
              className="inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
              <CalendarClock className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            className="w-[320px] overflow-hidden rounded-xl p-0">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-foreground">
                Đặt thời hạn bài viết
              </p>
            </div>
            <CalendarWithTime
              dateRange={scheduledDate}
              onDateRangeChange={setScheduledDate}
              timeFrom={scheduledTimeFrom}
              onTimeFromChange={setScheduledTimeFrom}
              timeTo={scheduledTimeTo}
              onTimeToChange={setScheduledTimeTo}
            />
          </DropdownMenuContent>
        </DropdownMenu> : null}
      </div>
    </>
  );
};

export default UserAction;
