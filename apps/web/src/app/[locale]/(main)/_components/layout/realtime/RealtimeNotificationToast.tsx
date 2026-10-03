import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import { Heart } from "lucide-react";

export type RealtimeToastPayload = {
  message: string;
  avatar?: string;
  originPostId?: string;
  type?: string;
};

export type RealtimeNotificationToastProps = RealtimeToastPayload & {
  onOpenPost?: (originPostId: string) => void;
};

export function RealtimeNotificationToast({
  message,
  avatar,
  originPostId,
  type,
  onOpenPost,
}: RealtimeNotificationToastProps) {
  const isClickable = Boolean(originPostId && onOpenPost);
  const containerClassName =
    "w-[420px] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-background p-4 shadow-xl opacity-100";

  const content = (
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        <AvatarGroup size={12} url={avatar ?? ""} />
        {type === "LIKE" && (
          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-foreground leading-relaxed break-words">
          {message}
        </p>
        {isClickable ? (
          <p className="mt-2 text-xs font-medium text-blue-600">Xem bài viết</p>
        ) : null}
      </div>
    </div>
  );

  if (!isClickable || !originPostId || !onOpenPost) {
    return <div className={containerClassName}>{content}</div>;
  }

  return (
    <button
      type="button"
      className={`${containerClassName} text-left cursor-pointer`}
      onClick={() => onOpenPost(originPostId)}
    >
      {content}
    </button>
  );
}
