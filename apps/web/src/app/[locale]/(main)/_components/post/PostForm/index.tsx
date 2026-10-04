import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks";
import { useModal } from "@/hooks/use-modal";
import {
  ImageIcon,
  Smile,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";
import NewPostModal from "../NewPostModal";

const PostForm = ({ variant = "default" }: { variant?: "default" | "feed" }) => {
  const { show, hide } = useModal();
  const t = useTranslations();
  const { user, isAuthenticated } = useAuth();

  const openComposer = () => {
    if (!isAuthenticated) return;
    show(<NewPostModal onClose={hide} />);
  };

  if (variant === "feed") {
    return (
      <div className="flex min-h-[88px] items-center gap-6 rounded-xl border border-[#e5e7eb] bg-white px-4 py-5 sm:px-6">
        <AvatarGroup
          size={10}
          url={user?.avatar ?? ""}
          fallBack={user?.username?.slice(0, 2).toUpperCase() ?? "PB"}
        />

        <div className="flex min-w-0 flex-1 items-center gap-6">
          <button
            type="button"
            onClick={openComposer}
            aria-disabled={!isAuthenticated}
            title={!isAuthenticated ? "Đăng nhập để tạo bài viết" : undefined}
            className="flex h-12 min-w-0 flex-1 items-center rounded-[11px] bg-[#f9fafb] px-5 text-left text-base text-[#4d5761] transition-colors hover:bg-[#f3f4f6]"
          >
            <span className="truncate">Bạn đang nghĩ gì?</span>
          </button>

          <div className="hidden shrink-0 gap-1.5 sm:flex">
            <button
              type="button"
              aria-label="Thêm hình ảnh"
              onClick={openComposer}
              className="flex size-9 items-center justify-center rounded-full text-[#4d5761] transition-colors hover:bg-[#f9fafb] hover:text-[#0d121c]"
            >
              <ImageIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Thêm video"
              onClick={openComposer}
              className="flex size-9 items-center justify-center rounded-full text-[#4d5761] transition-colors hover:bg-[#f9fafb] hover:text-[#0d121c]"
            >
              <Video className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Thêm cảm xúc"
              onClick={openComposer}
              className="flex size-9 items-center justify-center rounded-full text-[#4d5761] transition-colors hover:bg-[#f9fafb] hover:text-[#0d121c]"
            >
              <Smile className="size-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="px-6 py-3  border-0 rounded-none shadow-none cursor-pointer bg-primary-foreground ">
        <CardContent className="flex items-center p-0">

          <AvatarGroup size={6} url={user?.avatar ?? ""} fallBack={user?.username?.slice(0, 2).toUpperCase()} />

          <div className="flex-1">
            <Input
              type="text"
              onClick={() => {
                openComposer();
              }}
              readOnly={true}
              placeholder={t("post.whatsNew")}
              className=" placeholder:align-middle h-auto !bg-transparent rounded-none px-2 text-foreground-100 border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            />
          </div>

          <Button
            onClick={() => {
              openComposer();
            }}
            className="border-foreground border transition-none !bg-primary-foreground text-foreground cursor-pointer"
          >
            {t("common.post")}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default PostForm;

