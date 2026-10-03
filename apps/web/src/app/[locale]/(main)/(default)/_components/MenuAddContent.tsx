import MenuPopup from "@/app/[locale]/(main)/_components/common/MenuPopup";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

const MenuAddContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  const t = useTranslations();

  const handleAddMenu = (path: string) => {
    router.push(path);
  };

  const menuItems: { label: string; onClick: () => void; icon?: ReactNode }[] =
    [
      {
        label: t("menu.search"),
        onClick: () => {
          handleAddMenu("/search");
        },
      },
      {
        label: t("menu.activity"),
        onClick: () => {
          handleAddMenu("/activity");
        },
      },
      {
        label: t("menu.profile"),
        onClick: () => {
          handleAddMenu("/profile");
        },
      },
    ];

  return (
    <MenuPopup
      motionProps={{
        initial: {
          opacity: 0,
          y: 0,
          x: -30,
        },
        animate: {
          opacity: 1,
          y: 5,
          x: -30,
        },
        transition: {
          duration: 0.18,
          ease: "easeOut",
        },
      }}
      className={`${cn(`p-0 hover:bg-transparent! ${className}`)}`}
      buttonActive={children}
    >
      {menuItems.map((item, i) => (
        <DropdownMenuItem
          key={i}
          className="flex items-center justify-between gap-2"
          {...(item?.onClick && { onClick: item.onClick })}
        >
          <span>{item.label}</span>
          {item.icon}
        </DropdownMenuItem>
      ))}
    </MenuPopup>
  );
};

export default MenuAddContent;
