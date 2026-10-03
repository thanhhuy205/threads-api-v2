import ThreadIconSmall from "@/app/[locale]/(main)/_components/common/Icon/TheardIconSmall";
import ModalPopup from "@/app/[locale]/(main)/_components/common/ModalPopup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toPng } from "html-to-image";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import PostCard from "../PostCard";
import type { MappedPost } from "../type";

const ModalShare = ({
  onClose,
  post,
}: {
  post: MappedPost | null;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations();
  if (!post) return null;

  const handleDownload = async () => {
    if (!ref.current) return;

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `post-${post.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Lỗi khi export:", err);
    }
  };

  const handleCopy = async () => {
    if (!ref.current) return;

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await toast.promise(
        navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]),
        {
          loading: t("share.copying"),
          success: t("share.copySuccess"),
          error: t("share.copyError"),
        }
      );
    } catch (err) {
      console.error("Lỗi khi sao chép ảnh:", err);
    }
  };

  return (
    <ModalPopup modeSheet="fit" onClose={onClose}>
      <div className="p-10 relative rounded-tl-xl rounded-tr-xl bg-[#f5f5f5]">
        <div
          ref={ref}
          className="relative p-6 rounded-2xl bg-primary-foreground"
        >
          <PostCard post={post} mode="static" />
          <div className="absolute right-4 bottom-4 size-6 opacity-60">
            <ThreadIconSmall />
          </div>
        </div>

        <div className="absolute flex items-center gap-3 bottom-2 left-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border-2 border-blue-500 rounded-full"></div>
            <div className="w-6 h-6 bg-black rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2">
          <Checkbox
            className="p-3 rounded-full flex items-center justify-center"
            defaultChecked
          />
          <label className="text-sm font-medium cursor-pointer">
            {t("share.showStats")}
          </label>
        </div>

        <Button variant="outline" size="sm" className="p-5 rounded-xl gap-2">
          {t("share.auto")} <ChevronDown />
        </Button>

        <div className="flex items-center gap-3 *:text-background">
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
          >
            <svg
              className="text-primary"
              fill="currentColor"
              viewBox="0 0 21 21"
            >
              <path d="M10.285 13.272c-.205 0-.403-.073-.6-.271L7.237 10.65a.643.643 0 0 1-.213-.476c0-.381.308-.645.674-.645.19 0 .374.074.506.22l.952 1.01.454.565-.095-1.084V2.754a.764.764 0 0 1 1.53 0v7.486l-.095 1.084.454-.564.952-1.011a.672.672 0 0 1 .506-.22c.359 0 .674.264.674.645 0 .198-.08.344-.213.476L10.878 13c-.198.198-.396.271-.593.271Zm-4.248 4.673c-1.626 0-2.498-.864-2.498-2.483V8.35c0-1.619.872-2.483 2.498-2.483h1.955v1.677H6.19c-.637 0-.974.323-.974.99v6.752c0 .66.337.982.974.982h8.152c.63 0 .982-.323.982-.982V8.533c0-.666-.352-.989-.982-.989H12.57V5.867h1.926c1.633 0 2.498.864 2.498 2.483v7.112c0 1.619-.865 2.483-2.498 2.483h-8.46Z"></path>
            </svg>
          </Button>

          <Button
            onClick={handleCopy}
            size="sm"
            className="bg-black  hover:bg-black/90 border-primary"
          >
            {t("share.copy")}
          </Button>
        </div>
      </div>
    </ModalPopup>
  );
};

export default ModalShare;

