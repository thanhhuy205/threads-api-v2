import MenuPopup, { type MenuItem } from "@/app/[locale]/(main)/_components/common/MenuPopup";
import { useRepostPostMutation } from "@/features/post/api";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { MessageSquareQuote, Repeat2 } from "lucide-react";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import QuoteModal from "../QuoteModal";
import type { MappedPost } from "../type";

const RepostMenu = ({
  post,
  children,
  className,
  isAuth,
  onUnauthorizedClick,
}: {
  post: MappedPost | undefined;
  children: ReactNode;
  className?: string;
  isAuth: boolean;
  onUnauthorizedClick?: () => void;
}) => {
  const t = useTranslations();
  const { mutateAsync: repostPost } = useRepostPostMutation();
  const { show, hide } = useModal();

  const handleRepost = async () => {
    if (!post) return;

    try {
      await toast.promise(repostPost(post.id), {
        loading: post.isRepostByAuth
          ? t("repost.unreposting")
          : t("repost.reposting"),
        success: post.isRepostByAuth
          ? t("repost.unrepostSuccess")
          : t("repost.repostSuccess"),
        error: t("common.error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const repostIcon = (
    <Repeat2 className={cn(post?.isRepostByAuth && "text-red-500")} />
  );

  const repostLabel = post?.isRepostByAuth
    ? t("menu.unrepost")
    : t("menu.repost");

  const repostMenu: MenuItem[] = [
    {
      icon: repostIcon,
      label: repostLabel,
      onClick: handleRepost,
    },
    {
      icon: <MessageSquareQuote />,
      label: t("menu.quote"),
      onClick: () => {
        if (!post) return;
        show(<QuoteModal post={post} onClose={hide} />);
      },
    },
  ];

  const styledChildren = isValidElement(children) ? (
    <span className={cn(post?.isRepostByAuth && "text-red-500")}>
      {children}
    </span>
  ) : (
    children
  );

  if (!isAuth) {
    return (
      <button
        className={cn(
          "flex items-center gap-1",
          post?.isRepostByAuth && "text-red-500",
        )}
        onClick={onUnauthorizedClick}
      >
        {styledChildren}
      </button>
    );
  }

  return (
    <MenuPopup
      items={repostMenu}
      motionProps={{
        initial: { opacity: 0, x: 0 },
        animate: { opacity: 1, x: 0 },
      }}
      className={cn(className)}
      buttonActive={styledChildren}
    ></MenuPopup>
  );
};

export default RepostMenu;

