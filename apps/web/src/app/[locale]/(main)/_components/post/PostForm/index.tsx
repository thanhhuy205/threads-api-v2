import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks";
import { useModal } from "@/hooks/use-modal";
import { BarChart3, ImageIcon, Layers3 } from "lucide-react";
import { useTranslations } from "next-intl";
import NewPostModal from "../NewPostModal";

const PostForm = ({ variant = "default" }: { variant?: "default" | "feed" }) => {
  const { show, hide } = useModal();
  const t = useTranslations();
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  const openComposer = () => {
    show(<NewPostModal onClose={hide} />);
  };

  if (variant === "feed") {
    const roleLabel = user?.role === "ADMIN" ? "Quản trị viên" : "Thành viên";

    return (
      <div className="flex items-start gap-3 border-b border-border px-5 py-4">
        <AvatarGroup
          size={8}
          url={user?.avatar ?? ""}
          fallBack={user?.username?.slice(0, 2).toUpperCase()}
        />

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={openComposer}
            className="block w-full pt-1.5 text-left text-[14.5px] text-muted-foreground"
          >
            Chia sẻ điều gì đó với đội…
          </button>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={openComposer}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 font-mono text-[10.5px] font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Layers3 className="size-3" />
              Đăng với vai trò {roleLabel}
            </button>

            <div className="ml-auto flex gap-1.5">
              <button
                type="button"
                aria-label="Thêm hình ảnh"
                onClick={openComposer}
                className="flex size-[30px] items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ImageIcon className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Tạo khảo sát"
                onClick={openComposer}
                className="flex size-[30px] items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <BarChart3 className="size-3.5" />
              </button>
            </div>
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

