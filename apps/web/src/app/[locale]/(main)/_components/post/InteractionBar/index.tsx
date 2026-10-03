import AuthSocialModal from "@/app/[locale]/(auth)/_components/LoginModal";
import {
  getInteractionAuthConfig,
  type ActionKey,
} from "@/constant/pageTitless";
import { useCurrentUser } from "@/features/auth/hooks";
import { useLikePostMutation, useSavePostMutation } from "@/features/post/api";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { ReplyPermission } from "@/types/post";
import {
  Bookmark,
  Forward,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useContext, type MouseEvent } from "react";
import { PostContext } from "../PostContext";
import ReplyModal from "../ReplyModal";
import RepostMenu from "../RepostMenu";
import ShareMenu from "../ShareMenu";
import type { InteractionBarProps } from "../type";
import ReplyIcon from "./Icons/ReplyIcon";
import RepostIcon from "./Icons/RepostIcon";
import ShareIcon from "./Icons/ShareIcon";
import TymIcon from "./Icons/TymIcon";
import styles from "./interactionbar.module.css";

const InteractionBar = ({
  mode = "auto",
  size = 18,
  iconClass = "",
  className,
  variant = "default",
}: InteractionBarProps & {
  size?: number;
  iconClass?: string;
  className?: string;
  variant?: "default" | "feed";
}) => {
  const ctx = useContext(PostContext);
  const currentUser = useCurrentUser();

  const { show, hide } = useModal();
  const { mutateAsync: likePost } = useLikePostMutation();
  const { mutateAsync: savePost } = useSavePostMutation();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const loginRoute = `/${locale}/login`;

  const isComment = mode === "comment";
  const iconSize = isComment ? size - 4 : size;
  const textSize = isComment ? "text-[10px]" : "text-xs";
  const gap = isComment ? "gap-0" : "gap-0";

  const canReplyByPermission = () => {
    if (!ctx?.post) return false;
    if (!currentUser) return true;
    const isOwner =
      String(ctx.post.user?.id ?? "") === String(currentUser.id ?? "");
    if (isOwner) return true;

    switch (ctx.post.replyPermission) {
      case ReplyPermission.EVERYONE:
        return true;
      case ReplyPermission.FOLLOWERS:
        return Boolean(ctx.post.isFollowingAuthor);
      case ReplyPermission.FOLLOWING:
        return Boolean(ctx.post.isFollowedByAuthor);
      case ReplyPermission.MENTIONED:
        return (ctx.post.mentions ?? []).some(
          (mention: { userId: string }) =>
            String(mention.userId) === String(currentUser.id),
        );
      default:
        return true;
    }
  };

  const canReply = canReplyByPermission();

  const openAuthModal = (action?: ActionKey) => {
    console.log(currentUser);

    if (!action) {
      show(
        <AuthSocialModal
          onContinue={() => router.push(loginRoute)}
          onClose={hide}
        />,
      );
      return;
    }

    const cfg = getInteractionAuthConfig(t)[action];
    show(
      <AuthSocialModal
        title={cfg.title}
        description={cfg.description}
        buttonText={cfg.buttonText}
        Icon={cfg.Icon}
        iconGradient={cfg.iconGradient}
        onContinue={() => router.push(loginRoute)}
        onClose={hide}
      />,
    );
  };

  const handleLike = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!ctx?.post) return;

    if (!currentUser) {
      openAuthModal("like");
      return;
    }

    await likePost({
      publicId: ctx.post.id,
      isLiked: !ctx.post.isLikedByAuth,
    });
  };

  const handleReply = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!currentUser) {
      openAuthModal("reply");
      return;
    }

    if (!canReply) {
      return;
    }

    if (!ctx?.post) return;
    show(<ReplyModal post={ctx?.post} onClose={hide} />);
  };

  const handleSave = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!ctx?.post) return;

    if (!currentUser) {
      openAuthModal();
      return;
    }

    await savePost({
      publicId: ctx.post.id,
      isSaved: !ctx.post.isSavedByAuth,
    });
  };

  const isTypeCard = !!ctx?.post?.type;

  if (variant === "feed") {
    const actionClass =
      "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12.5px] font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

    return (
      <div className={cn("flex w-full items-center gap-1", className)}>
        <button
          onClick={handleLike}
          className={cn(actionClass, ctx?.post.isLikedByAuth && "text-red-500")}
        >
          <Heart
            className={cn("size-[15px]", ctx?.post.isLikedByAuth && "fill-current")}
          />
          <span>{t("post.like")} · {ctx?.post.likesCount ?? 0}</span>
        </button>

        <button
          onClick={handleReply}
          disabled={Boolean(currentUser) && !canReply}
          className={cn(
            actionClass,
            Boolean(currentUser) && !canReply &&
              "cursor-not-allowed opacity-50",
          )}
        >
          <MessageCircle className="size-[15px]" />
          <span>{t("post.reply")} · {ctx?.post.repliesCount ?? 0}</span>
        </button>

        <button
          onClick={handleSave}
          className={cn(actionClass, ctx?.post.isSavedByAuth && "text-foreground")}
        >
          <Bookmark
            className={cn("size-[15px]", ctx?.post.isSavedByAuth && "fill-current")}
          />
          <span>{t("common.save")}</span>
        </button>

        <ShareMenu
          isAuth={!!currentUser}
          onUnauthorizedClick={() => openAuthModal("share")}
          className={cn(actionClass, "ml-auto")}
          post={ctx?.post || undefined}
        >
          <Share2 className="size-[15px]" />
          <span>{t("post.share")}</span>
        </ShareMenu>
      </div>
    );
  }

  if (isTypeCard) {
    return (
      <div className="grid w-full grid-cols-4 divide-x divide-border border-t border-border/60 text-muted-foreground">
        <button onClick={handleLike} className={cn("flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-muted/40 hover:text-foreground", ctx.post.isLikedByAuth && "text-blue-600")}>
          <ThumbsUp className="size-5" />
          <span>
            {t("post.like")} ({ctx.post.likesCount ?? 0})
          </span>
        </button>
        <button onClick={handleReply} disabled={Boolean(currentUser) && !canReply} className="flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-muted/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50">
          <MessageCircle className="size-5" />
          <span>{t("post.reply")}</span>
        </button>
        <button onClick={handleSave} className={cn("flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-muted/40 hover:text-foreground", ctx.post.isSavedByAuth && "text-blue-600")}>
          <Bookmark className="size-5" />
          <span>{t("common.save")}</span>
        </button>
        <ShareMenu isAuth={!!currentUser} onUnauthorizedClick={() => openAuthModal("share")} post={ctx.post} className="flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-muted/40 hover:text-foreground">
          <Forward className="size-5" />
          <span>{t("post.share")}</span>
        </ShareMenu>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          `flex text-foreground items-center ${gap} ${
            mode === "share" ? "pointer-events-none opacity-50" : ""
          }`,
        )}
      >
        <button
          onClick={handleLike}
          className={`hover:bg-[#ccc] ${styles.interactionButton} ${
            isComment ? "!px-1 scale-90" : ""
          } ${ctx?.post.isLikedByAuth ? "text-red-500" : ""}`}
        >
          <TymIcon
            activeColor="red"
            active={ctx?.post.isLikedByAuth}
            size={iconSize}
            className={iconClass}
          />
          <span
            className={`${textSize} interaction-bar`}
            data-label="like"
            title="Like"
          >
            {ctx?.post.likesCount || 0}
          </span>
        </button>

        <button
          onClick={handleReply}
          disabled={Boolean(currentUser) && !canReply}
          className={` ${styles.interactionButton} ${
            isComment ? "!px-1 scale-90" : ""
          } ${Boolean(currentUser) && !canReply ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ReplyIcon size={iconSize} className={iconClass} />
          <span
            className={`${textSize} interaction-bar`}
            data-label="reply"
            title="Reply"
          >
            {ctx?.post.repliesCount || 0}
          </span>
        </button>

        <RepostMenu
          post={ctx?.post || undefined}
          isAuth={!!currentUser}
          onUnauthorizedClick={() => openAuthModal("repost")}
          className={` ${styles.interactionButton} ${
            isComment ? "!px-1 scale-90" : ""
          } ${ctx?.post.isRepostByAuth ? "text-green-500" : ""}`}
        >
          <RepostIcon size={iconSize} className={`${iconClass} `} />
          <span
            className={`${textSize} interaction-bar`}
            data-label="repost"
            title="Repost"
          >
            {ctx?.post.repostsCountAndQuoteCount || 0}
          </span>
        </RepostMenu>

        <ShareMenu
          isAuth={!!currentUser}
          onUnauthorizedClick={() => openAuthModal("share")}
          className={`${styles.interactionButton} ${
            isComment ? "!px-1 scale-90" : ""
          } ${ctx?.post.isSavedByAuth ? "text-gray-700" : ""}`}
          post={ctx?.post || undefined}
        >
          <ShareIcon size={iconSize} className={iconClass} />
          <span
            className={`${textSize} interaction-bar`}
            data-label="share"
            title="Share"
          >
            {ctx?.post.repostsCountAndQuoteCount || 0}
          </span>
        </ShareMenu>
      </div>
    </>
  );
};

export default InteractionBar;
