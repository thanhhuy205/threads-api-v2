import MenuPopup, { type MenuItem } from "@/app/[locale]/(main)/_components/common/MenuPopup";
import ModalSmall from "@/app/[locale]/(main)/_components/common/ModalSmall";
import { useAuth } from "@/features/auth/hooks";
import { useDeleteThreadMutation, useSavePostMutation } from "@/features/post/api";
import { useModal } from "@/hooks/use-modal";
import {
  Bookmark,
  EyeOff,
  Info,
  Link2,
  Pin,
  Shield,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, type ReactNode } from "react";
import { toast } from "sonner";

const MenuMe = ({
  buttonActive,
  threadId,
  isSaved = false,
}: {
  buttonActive: ReactNode;
  threadId: string;
  isSaved?: boolean;
}) => {
  const t = useTranslations();
  const { show, hide } = useModal();
  const { user } = useAuth();
  const { mutateAsync: deleteThread } = useDeleteThreadMutation();
  const { mutateAsync: savePost } = useSavePostMutation();

  const handleSave = useCallback(
    async (postId: string, currentIsSaved: boolean) => {
      await toast.promise(
        savePost({ publicId: postId, isSaved: !currentIsSaved }),
        {
          loading: t("toast.saving"),
          success: () => t("toast.saveSuccess"),
          error: (err: any) =>
            err?.response?.data?.message || err?.message || t("toast.saveError"),
        }
      );
    },
    [savePost, t]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await deleteThread(id);
        if (result?.success) {
          return toast.success(t("menu.deleteSuccess"));
        }
      } catch {
        toast.error(t("menu.deleteError"));
      } finally {
        hide();
      }
    },
    [deleteThread, hide, t]
  );

  const handleCopyLink = useCallback(async () => {
    if (!user) return;

    const url = `${window.location.origin}/${user.username}/post/${threadId}`;
    await navigator.clipboard.writeText(url);
    toast.success(t("menu.copyLinkSuccess"));
  }, [threadId, t, user]);

  const items: MenuItem[] = useMemo(() => [
    // {
    //   label: t("menu.postDetails"),
    //   icon: <Info />,
    //   isAuth: true,
    //   isHeader: true,
    // },
    {
      label: isSaved ? t("menu.unsave") : t("menu.save"),
      icon: <Bookmark className={isSaved ? "text-yellow-500 fill-yellow-500" : ""} />,
      className: isSaved ? "text-yellow-500" : "",
      isAuth: true,
      onClick: () => handleSave(threadId, isSaved),
    },
    // {
    //   label: t("menu.pinToProfile"),
    //   icon: <Pin />,
    //   isAuth: true,
    // },
    // {
    //   label: t("menu.hideStats"),
    //   icon: <EyeOff />,
    //   isAuth: true,
    // },
    // {
    //   label: t("menu.controlOptions"),
    //   icon: <Shield />,
    //   isAuth: true,
    // },
    {
      label: t("menu.delete"),
      icon: <Trash2 />,
      isAuth: true,
      className: "text-destructive hover:bg-destructive/10",
      onClick: () =>
        show(
          <ModalSmall
            onCancel={hide}
            onConfirm={() => void handleDelete(threadId)}
            mode="delete"
          />
        ),
    },
    {
      label: t("menu.copyLink"),
      icon: <Link2 />,
      isAuth: false,
      onClick: handleCopyLink,
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [isSaved, threadId, t]);

  return (
    <MenuPopup
      items={items}
      className="cursor-pointer "
      buttonActive={buttonActive}
      customPopup="-translate-x-20"
      motionProps={{
        initial: { opacity: 0, x: 0, scale: 0.96 },
        animate: { opacity: 1, x: 0, scale: 1 },
      }}
    ></MenuPopup>
  );
};

export default MenuMe;

