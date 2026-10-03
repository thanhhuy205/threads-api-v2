import MenuPopup, { type MenuItem } from "@/app/[locale]/(main)/_components/common/MenuPopup";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { Code, Image, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode } from "react";
import { toast } from "sonner";
import ModalEmbedCode from "../ModalEmbedCode";
import ModalShare from "../ModalShare";
import type { MappedPost } from "../type";

const ShareMenu = ({
  children,
  className,
  isAuth,
  onUnauthorizedClick,
  post,
}: {
  post: MappedPost | undefined;
  children: ReactNode;
  className: string;
  isAuth: boolean;
  onUnauthorizedClick?: () => void;
}) => {
  const t = useTranslations();
  const { show, hide } = useModal();

  const shareMenu: MenuItem[] = [
    {
      icon: <Link2 />,
      label: t("menu.copyLink"),
      onClick: async () => {
        toast.promise(
          navigator.clipboard.writeText(
            `${window.location.origin}/post/${post?.id}`
          ),
          {
            loading: t("share.copying"),
            success: t("share.copySuccess"),
            error: t("share.copyError"),
          }
        );
      },
    },
    {
      icon: <Image />,
      label: t("menu.copyAsImage"),
      onClick: () => {
        show(<ModalShare post={post ?? null} onClose={hide} />);
      },
    },
    {
      icon: <Code />,
      label: t("menu.embedCode"),
      onClick: () => {
        show(<ModalEmbedCode post={post!} onClose={hide} />);
      },
    },
  ];

  if (!isAuth) {
    return (
      <button
        className="flex items-center gap-1 cursor-pointer"
        onClick={onUnauthorizedClick}
      >
        {children}
      </button>
    );
  }

  return (
    <MenuPopup
      items={shareMenu}
      motionProps={{
        initial: { opacity: 0, x: 0 },
        animate: { opacity: 1, x: 0 },
      }}
      className={cn(className)}
      buttonActive={children}
    ></MenuPopup>
  );
};

export default ShareMenu;

