import { ShieldCheck, AlertTriangle, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

export type RealtimeReportPayload = {
  reportId: string;
  targetPublicId: string;
  targetType: string;
  message: string;
  action: "none" | "disinformation" | "hide" | string;
};

export type RealtimeReportToastProps = RealtimeReportPayload & {
  toastId: string | number;
  onOpenTarget?: (type: string, publicId: string) => void;
};

export function RealtimeReportToast({
  reportId,
  targetPublicId,
  targetType,
  message,
  action,
  toastId,
  onOpenTarget,
}: RealtimeReportToastProps) {
  const isClickable = Boolean(targetPublicId && targetType && onOpenTarget);

  let themeStyles = {
    borderColor:
      "border-emerald-500/20 hover:border-emerald-500/40 dark:border-emerald-500/10 dark:hover:border-emerald-500/30",
    glowColor:
      "shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)] dark:shadow-[0_0_25px_-5px_rgba(16,185,129,0.1)]",
    icon: <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />,
    badgeText: "Báo cáo đã xử lý",
    badgeStyles:
      "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    title: "Phản hồi báo cáo",
    buttonText: "Xem chi tiết",
  };

  if (action === "disinformation") {
    themeStyles = {
      borderColor:
        "border-amber-500/20 hover:border-amber-500/40 dark:border-amber-500/10 dark:hover:border-amber-500/30",
      glowColor:
        "shadow-[0_0_20px_-3px_rgba(245,158,11,0.15)] dark:shadow-[0_0_25px_-5px_rgba(245,158,11,0.1)]",
      icon: (
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
      ),
      badgeText: "Thông tin sai lệch",
      badgeStyles: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      title: "Cảnh báo thông tin",
      buttonText: "Kiểm tra nguồn",
    };
  } else if (action === "hide") {
    themeStyles = {
      borderColor:
        "border-purple-500/20 hover:border-purple-500/40 dark:border-purple-500/10 dark:hover:border-purple-500/30",
      glowColor:
        "shadow-[0_0_20px_-3px_rgba(168,85,247,0.15)] dark:shadow-[0_0_25px_-5px_rgba(168,85,247,0.1)]",
      icon: <EyeOff className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />,
      badgeText: "Đã ẩn nội dung",
      badgeStyles:
        "bg-purple-500/10 text-purple-500 border border-purple-500/20",
      title: "Kiểm duyệt nội dung",
      buttonText: "Xem bài viết ẩn",
    };
  }

  let navigationLabel = themeStyles.buttonText;
  const upperType = targetType.toUpperCase();
  if (upperType === "POST") {
    navigationLabel = "Xem bài viết";
  } else if (upperType === "USER") {
    navigationLabel = "Xem trang cá nhân";
  }

  return (
    <div
      className={`relative w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border ${themeStyles.borderColor} ${themeStyles.glowColor} bg-background/95 backdrop-blur-md p-5 shadow-2xl transition-all duration-300 hover:scale-[1.01]`}
    >
      <button
        onClick={() => toast.dismiss(toastId)}
        type="button"
        className="absolute top-4 right-4 text-muted-foreground/60 hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
        aria-label="Đóng"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-4">
        <div className="flex items-center justify-center p-2 rounded-xl bg-muted/50 h-10 w-10 shrink-0">
          {themeStyles.icon}
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${themeStyles.badgeStyles}`}
            >
              {themeStyles.badgeText}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-foreground mb-1 leading-snug">
            {themeStyles.title}
          </h4>

          <p className="text-[14px] text-muted-foreground leading-relaxed break-words">
            {message}
          </p>

          {isClickable && (
            <button
              onClick={() => onOpenTarget!(targetType, targetPublicId)}
              type="button"
              className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer transition-all duration-200"
            >
              {navigationLabel}
              <span className="text-[10px]">&rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
