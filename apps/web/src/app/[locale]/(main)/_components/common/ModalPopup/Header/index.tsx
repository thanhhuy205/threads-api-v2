import MenuPopup from "@/app/[locale]/(main)/_components/common/MenuPopup";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  VisibilityPost,
  type VisibilityPost as VisibilityPostValue,
} from "@/types/post";
import { Globe, X } from "lucide-react";

const Header = ({
  onClose,
  headerText,
  mode,
  className,
  visibility,
  onVisibilityChange,
}: {
  onClose: () => void;
  headerText: string;
  mode?: "x";
  className?: string;
  visibility?: VisibilityPostValue;
  onVisibilityChange?: (value: VisibilityPostValue) => void;
}) => {
  const t = useTranslations();
  const visibilityOptions = [
    { value: VisibilityPost.WORKSPACE, label: t("post.visibilityCompany") },
    { value: VisibilityPost.FRIEND, label: t("post.visibilityTeam") },
    { value: VisibilityPost.PRIVATE, label: t("post.visibilityMentioned") },
  ];

  return (
    <>
      <CardHeader
        className={cn(
          `flex flex-row items-center border-b space-y-0 !py-2 ${
            mode ? "!px-2" : ""
          }`,
          className,
        )}
      >
        <div className="flex-1 text-left">
          <Button
            variant="ghost"
            className="h-auto p-0 text-base hover:bg-transparent"
            onClick={onClose}
          >
            {mode === "x" ? <X /> : "Hủy"}
          </Button>
        </div>

        <div className="flex-1 text-sm lg:text-base font-bold text-center">
          {headerText}
        </div>

        <div className="flex justify-end flex-1 gap-2">
          {/* <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <Layers className="w-5 h-5" />
          </Button> */}
          {onVisibilityChange ? (
            <MenuPopup
              mode="short"
              className="w-8 h-8 rounded-full p-0"
              buttonActive={
                <Globe className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              }
              customPopup="absolute -translate-x-1/2 top-full mt-2"
            >
              <div className="font-semibold text-[15px] text-gray-600 px-1">
                {t("post.visibilityTitle")}
              </div>

              <div className="flex flex-col">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`py-2 text-left hover:bg-accent rounded-xl px-2 ${
                      visibility === option.value ? "bg-accent font-medium" : ""
                    }`}
                    onClick={() => onVisibilityChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </MenuPopup>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full"
            >
              <Globe className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Button>
          )}
        </div>
      </CardHeader>
    </>
  );
};

export default Header;
