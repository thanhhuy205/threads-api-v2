import { DarkIcon } from "@/app/[locale]/(main)/_components/common/Icon/DarkIcon";
import LightModeIcon from "@/app/[locale]/(main)/_components/common/Icon/LightModeIcon";
import MenuPopup from "@/app/[locale]/(main)/_components/common/MenuPopup";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useLogoutMutation } from "@/features/auth/hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageMenu } from "./LanguageMenu";
import { MainMenu } from "./MainMenu";
import { ThemeMenu } from "./ThemeMenu";
import { toast } from "sonner";

const SlideUpMenu = ({
  children,
  motionProps,
  customPopup,
  triggerClassName,
}: {
  children: React.ReactNode;
  motionProps?: {
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
    exit?: Record<string, unknown>;
    transition?: Record<string, unknown>;
  };
  customPopup?: string;
  triggerClassName?: string;
}) => {
  const { mutateAsync: logout } = useLogoutMutation();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const isMobile = useIsMobile();
  const [activeMenu, setActiveMenu] = useState<"main" | "theme" | "language">(
    "main",
  );
  const t = useTranslations();
  const { setTheme } = useTheme();

  const switchLocale = (nextLocale: "en" | "vi") => {
    if (nextLocale === locale) return;

    const segments = pathname.split("/").filter(Boolean);
    const currentLocale = segments[0];
    const localizedPath =
      currentLocale === "en" || currentLocale === "vi"
        ? `/${nextLocale}/${segments.slice(1).join("/")}`
        : `/${nextLocale}/${segments.join("/")}`;

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    router.replace(
      localizedPath === `/${nextLocale}/` ? `/${nextLocale}` : localizedPath,
    );
  };

  const mainMenu = [
    {
      label: t("menu.appearance"),
      icon: <ChevronRight size={16} />,
      onClick: () => setActiveMenu("theme"),
      isAuth: false,
    },
    // { label: t("menu.profileInfo"), isAuth: true },
    {
      label: t("menu.settings"),
      onClick: () => {
        toast.info("Hiện tại chỉ có UI không có logic");
        router.push(`/${isMobile ? "settings" : "settings/privacy"}`);
      },
      isAuth: true,
    },
    // { label: t("menu.feed"), isAuth: true },
    // { label: t("menu.liked"), pathName: "liked", isAuth: true },
    {
      label: t("menu.language"),
      icon: <ChevronRight size={16} />,
      onClick: () => setActiveMenu("language"),
    },
    {
      label: t("menu.logout"),
      onClick: async () => {
        await logout();
        router.replace("/");
      },
      danger: true,
      isAuth: true,
    },
  ];

  const themeMenu = [
    {
      label: "Light",
      icon: <LightModeIcon className="w-4 h-4" />,
      value: "light" as const,
      onClick: () => setTheme("light"),
    },
    {
      label: "Dark",
      icon: <DarkIcon className="w-4 h-4" />,
      value: "dark" as const,
      onClick: () => setTheme("dark"),
    },
    {
      label: "Auto",
      value: "system" as const,
      onClick: () => setTheme("system"),
    },
  ];

  const languageMenu = [
    {
      label: t("menu.vietnamese"),
      value: "vi",
      onClick: () => switchLocale("vi"),
    },
    {
      label: t("menu.english"),
      value: "en",
      onClick: () => switchLocale("en"),
    },
    {
      value: "back",
      label: t("menu.back"),
      icon: <ArrowLeft size={16} />,
      onClick: () => setActiveMenu("main"),
    },
  ];
  return (
    <MenuPopup
      className={triggerClassName}
      customPopup={customPopup}
      motionProps={motionProps}
      buttonActive={children}
    >
      {activeMenu === "main" && <MainMenu items={mainMenu} />}
      {activeMenu === "theme" && (
        <ThemeMenu onClick={() => setActiveMenu("main")} items={themeMenu} />
      )}
      {activeMenu === "language" && (
        <LanguageMenu
          onClick={() => setActiveMenu("main")}
          items={languageMenu}
        />
      )}
    </MenuPopup>
  );
};

export default SlideUpMenu;
