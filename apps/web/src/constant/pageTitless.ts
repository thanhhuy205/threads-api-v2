import { CommentIconThreads } from "@/app/[locale]/(main)/_components/common/Icon/CommentIconThreads";
import { RepostIconThreads } from "@/app/[locale]/(main)/_components/common/Icon/RepostIconThreads";
import { TymIconThreads } from "@/app/[locale]/(main)/_components/common/Icon/TymIconThreads";
import { Send } from "lucide-react";
import type { ElementType } from "react";
export const PAGE_TITLES_BY_PATH: Record<string, string> = {
  "/": "home",
  "/search": "search",
  "/favorites": "favorites",
  "/profile": "profile",
  "/profile/replies": "profile",
  "/profile/media": "profile",
  "/profile/reposts": "profile",
  "/activity": "activity",
  "/settings": "settings",
  "/settings/help": "help",
  "/settings/privacy": "privacy",
  "/settings/account": "account",
  "/settings/account_status": "account_status",
};

export const PAGE_CHILDREN_BY_PATH: Record<string, string> = {
  "/settings/help": "/settings",
  "/settings/privacy": "/settings",
  "/settings/account": "/settings",
  "/settings/account_status": "/settings",
};

export const NAV_LINKS = [
  "/",
  "/search",
  "/favorites",
  "/profile",
  "/activity",
];

export type ActionKey = "like" | "reply" | "repost" | "share";
type InteractionType = Record<
  ActionKey,
  {
    title: string;
    description: string;
    buttonText: string;
    Icon: ElementType;
    iconGradient: string;
  }
>;

type TranslateFn = (key: string) => string;

export const getInteractionAuthConfig = (
  t: TranslateFn = (key) => key,
): InteractionType => ({
  like: {
    title: t("authModal.signUpToLike"),
    description: t("authModal.signUpToLikeDesc"),
    buttonText: t("auth.continueWithInstagram"),
    Icon: TymIconThreads,
    iconGradient: "from-pink-500 via-red-500 to-yellow-400",
  },

  reply: {
    title: t("authModal.signUpToReply"),
    description: t("authModal.signUpToReplyDesc"),
    buttonText: t("auth.continueWithInstagram"),
    Icon: CommentIconThreads,
    iconGradient: "from-blue-500 via-sky-400 to-cyan-300",
  },

  repost: {
    title: t("authModal.signUpToRepost"),
    description: t("authModal.signUpToRepostDesc"),
    buttonText: t("auth.continueWithInstagram"),
    Icon: RepostIconThreads,
    iconGradient: "from-green-500 via-lime-400 to-yellow-300",
  },

  share: {
    title: t("authModal.signUpToShare"),
    description: t("authModal.signUpToShareDesc"),
    buttonText: t("auth.continueWithInstagram"),
    Icon: Send,
    iconGradient: "from-purple-500 via-fuchsia-500 to-pink-400",
  },
});

// For backward compatibility
export const INTERACTION_AUTH_CONFIG = getInteractionAuthConfig();
