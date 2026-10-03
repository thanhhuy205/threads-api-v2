import MenuPopup, {
  type MenuItem,
} from "@/app/[locale]/(main)/_components/common/MenuPopup";
import ModalSmall from "@/app/[locale]/(main)/_components/common/ModalSmall";
import {
  useHidePostMutation,
  useReportPostMutation,
  useSavePostMutation,
} from "@/features/post/api";
import { useModal } from "@/hooks/use-modal";
import { Bookmark, EyeOff, Flag, Link2, UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import ReportPostModal from "./ReportPostModal";
import { configService } from "@/config";

const appUrl = configService.nextPublicBaseUrl;

const Menu = ({
  username,
  userId,
  postId,
  isSaved = false,
  isHidden = false,
  buttonActive,
}: {
  username: string;
  userId: number;
  postId: string | number;
  isSaved?: boolean;
  isHidden?: boolean;
  buttonActive: ReactNode;
}) => {
  const t = useTranslations();
  const { show, hide } = useModal();
  const { mutateAsync: savePost } = useSavePostMutation();
  const { mutateAsync: hidePost } = useHidePostMutation();
  const { mutateAsync: reportPost } = useReportPostMutation();

  const handleSave = useCallback(
    async (postId: string | number, currentIsSaved: boolean) => {
      await toast.promise(
        savePost({ publicId: postId.toString(), isSaved: !currentIsSaved }),
        {
          loading: t("toast.saving"),
          success: () => t("toast.saveSuccess"),
          error: (err: any) =>
            err?.response?.data?.message || err?.message || t("toast.saveError"),
        },
      );
    },
    [savePost, t]
  );

  const handleHide = useCallback(
    async (postId: string | number, currentIsHidden: boolean) => {
      hide();

      await toast.promise(
        hidePost({ publicId: postId.toString(), isHidden: !currentIsHidden }),
        {
          loading: t("toast.hiding"),
          success: t("toast.hideSuccess"),
          error: (err: any) =>
            err?.response?.data?.message || err?.message || t("toast.hideError"),
        },
      );
    },
    [hidePost, hide, t]
  );

  const handleCopyLink = useCallback(async () => {
    const fallbackOrigin =
      typeof window !== "undefined" ? window.location.origin : "";
    const origin = appUrl || fallbackOrigin;
    const url = `${origin}/${username}/post/${postId}`;

    await navigator.clipboard.writeText(url);
    toast.success(t("menu.copyLinkSuccess"));
  }, [appUrl, postId, t, username]);

  const handleSubmitReport = useCallback(
    async (reason?: string) => {
      if (!reason) return false;

      try {
        await reportPost({
          publicId: postId.toString(),
          reason,
          type: "post",
        });

        return true;
      } catch {
        return false;
      }
    },
    [postId, reportPost]
  );

  const handleReport = useCallback(() => {
    show(
      <ReportPostModal
        onClose={hide}
        onSubmit={async (reason) => {
          const ok = await handleSubmitReport(reason);

          if (!ok) {
            toast.error(t("toast.reportError"));
          }

          return ok;
        }}
      />,
    );
  }, [hide, handleSubmitReport, show, t]);

  const items: MenuItem[] = useMemo(
    () => [
      {
        icon: (
          <Bookmark
            className={isSaved ? "text-yellow-500 fill-yellow-500" : ""}
          />
        ),
        label: !isSaved ? t("menu.save") : t("menu.unsave"),
        className: isSaved ? "text-yellow-500" : "",
        isAuth: true,
        onClick: () => handleSave(postId, isSaved),
      },
      {
        icon: <Flag />,
        label: t("menu.report"),
        isAuth: true,
        onClick: handleReport,
      },
      {
        icon: <EyeOff />,
        label: t("menu.notInterested"),
        isAuth: true,
        onClick: () => handleHide(postId, isHidden),
      },
      // {
      //   icon: <UserX />,
      //   label: t("menu.block"),
      //   className: "text-destructive hover:bg-destructive/10",
      //   isAuth: true,
      //   onClick: () =>
      //     show(
      //       <ModalSmall
      //         username={username}
      //         userId={userId}
      //         mode="block"
      //         onCancel={hide}
      //         onConfirm={hide}
      //       />,
      //     ),
      // },
      {
        icon: <Link2 />,
        label: t("menu.copyLink"),
        isAuth: false,
        onClick: handleCopyLink,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSaved, isHidden, postId, t]
  );

  return (
    <MenuPopup
      items={items}
      buttonActive={buttonActive}
      customPopup="-translate-x-20"
      motionProps={{
        initial: { opacity: 0, x: 0, scale: 0.96 },
        animate: { opacity: 1, x: 0, scale: 1 },
      }}
    ></MenuPopup>
  );
};

export default Menu;
