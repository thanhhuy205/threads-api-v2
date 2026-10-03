import ModalPopup from "@/app/[locale]/(main)/_components/common/ModalPopup";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import PostCard from "../PostCard";
import type { MappedPost } from "../type";
import { configService } from "@/config";

const appUrl = configService.nextPublicBaseUrl;

const ModalEmbedCode = ({
  post,
  onClose,
}: {
  post: MappedPost;
  onClose: () => void;
}) => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  const origin =
    appUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const permalink = `${origin}/post/${post.id}`;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollLeft = useRef<number>(0);
  const startX = useRef<number>(0);
  const isDown = useRef<boolean>(false);

  const handleOnMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
    isDown.current = true;
  };

  const handleOnMouseLeave = () => (isDown.current = false);
  const handleOnMouseUp = () => (isDown.current = false);

  const handleOnMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const embedCode = `
<blockquote class="text-post-media"
  data-text-post-permalink="${permalink}"
  style="background:#FFF;border:1px solid #00000026;border-radius:16px;max-width:650px;margin:1px;min-width:270px;padding:0;width:calc(100% - 2px);">
  <a href="${permalink}" target="_blank"
    style="background:#FFFFFF;line-height:0;padding:0;text-align:center;text-decoration:none;width:100%;font-family:-apple-system, BlinkMacSystemFont, sans-serif;">
    <div style="padding:40px;display:flex;flex-direction:column;align-items:center;">
      <div style="display:block;height:32px;width:32px;padding-bottom:20px;">
      </div>
      <div style="font-size:15px;line-height:21px;color:#000;font-weight:600;">
        ${t("post.viewPost")}
      </div>
    </div>
  </a>
</blockquote>
<script async src=${origin}/embed.js></script>
`.trim();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ModalPopup isMobileSheet={false} onClose={onClose}>
      <div className="p-0 sm:p-6">
        <h2 hidden={isMobile} className="text-lg font-semibold mb-4">
          {t("post.embedTitle")}
        </h2>

        <div
          hidden={isMobile}
          className="rounded-xl overflow-hidden border bg-primary-foreground p-10"
        >
          <PostCard post={post} mode="static" />
        </div>

        <div className="flex items-center justify-between w-[90%] mx-auto my-auto md:w-full p-3 bg-muted rounded-xl sm:mt-4 border ">
          <div
            ref={scrollContainerRef}
            className="hide-scrollbar text-sm font-mono text-foreground whitespace-nowrap overflow-x-auto"
            style={{ maxWidth: "calc(100% - 110px)" }}
            onMouseDown={handleOnMouseDown}
            onMouseLeave={handleOnMouseLeave}
            onMouseUp={handleOnMouseUp}
            onMouseMove={handleOnMouseMove}
          >
            {embedCode}
          </div>

          <button
            onClick={handleCopy}
            className="ml-3 px-4 py-1.5 text-sm font-semibold bg-black text-white rounded-lg hover:bg-black/90 transition"
          >
            {copied ? t("post.copied") : t("post.copy")}
          </button>
        </div>

        <div hidden={isMobile} className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
      </div>
    </ModalPopup>
  );
};

export default ModalEmbedCode;

