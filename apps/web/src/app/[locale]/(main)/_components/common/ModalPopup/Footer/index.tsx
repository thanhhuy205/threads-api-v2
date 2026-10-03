import MenuPopup from "@/app/[locale]/(main)/_components/common/MenuPopup";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import {
  ReplyPermission,
  type ReplyPermission as ReplyPermissionValue,
} from "@/types/post";
import { MessageCircle } from "lucide-react";

const Footer = ({
  loading = false,
  onSubmit,
  content,
  loadingLabel,
  label = "Đăng bài",
  replyPermission = ReplyPermission.EVERYONE,
  onReplyPermissionChange,
}: {
  loading: boolean;
  onSubmit?: () => void;
  content?: string;
  loadingLabel?: string;
  label?: string;
  replyPermission?: ReplyPermissionValue;
  onReplyPermissionChange?: (value: ReplyPermissionValue) => void;
}) => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  const replyOptions = [
    { value: ReplyPermission.EVERYONE, label: t("reply.everyone") },
    { value: ReplyPermission.FOLLOWERS, label: t("reply.followers") },
    { value: ReplyPermission.FOLLOWING, label: t("reply.following") },
    { value: ReplyPermission.MENTIONED, label: t("reply.mentioned") },
  ];

  return (
    <CardFooter className="flex items-center justify-between p-3">
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <MenuPopup
          motionProps={{
            initial: { opacity: 0, y: isMobile ? 0 : 0 },
            animate: { opacity: 1, y: 0 },
          }}
          customPopup={
            isMobile
              ? "bottom-0 left-0 w-full bg-white dark:bg-neutral-900 rounded-t-2xl p-4 shadow-xl z-[999]"
              : "absolute bottom-full -left-25 -translate-y-10 mb-2 -p-2 h-auto z-[999]"
          }
          className="p-0 hover:bg-transparent cursor-pointer pl-1"
          buttonActive={
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-muted-foreground mr-1" />
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t("reply.replyOptions")}
              </span>
            </div>
          }
          mode={isMobile ? "short" : "medium"}
        >
          <div className="font-semibold text-[15px] mb-2 text-gray-600 px-1">
            {t("reply.whoCanReply")}
          </div>

          <div className="flex flex-col">
            {replyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`py-2 text-left hover:bg-accent rounded-xl px-2 ${
                  replyPermission === option.value
                    ? "bg-accent font-medium"
                    : ""
                }`}
                onClick={() => onReplyPermissionChange?.(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </MenuPopup>
      </div>

      <Button
        disabled={loading || !content}
        onClick={onSubmit}
        type="submit"
        className="cursor-pointer rounded-full px-5 font-semibold disabled:opacity-30 
                   bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black"
      >
        {loading ? loadingLabel : label}
      </Button>
    </CardFooter>
  );
};

export default Footer;
