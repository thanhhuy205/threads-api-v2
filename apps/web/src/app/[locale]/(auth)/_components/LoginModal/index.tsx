import ModalPopup from "@/app/[locale]/(main)/_components/common/ModalPopup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface AuthSocialModalProps {
  children?: React.ReactNode;
  onClose: () => void;
  onContinue: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  Icon?: React.ElementType;
  iconGradient?: string;
}

const AuthSocialModal: React.FC<AuthSocialModalProps> = ({
  onClose,
  onContinue,
  title,
  description,
  buttonText,
  Icon,
  iconGradient = "from-pink-500 via-red-500 to-yellow-400",
}) => {
  const t = useTranslations();
  const isMobile = useIsMobile();
  const content = (
    <div className="p-6 space-y-5">
      <div className="flex justify-center mb-4 md:hidden">
        <div className="w-12 h-1.5 bg-muted-foreground/50 rounded-full"></div>
      </div>

      {Icon && (
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-lg ${iconGradient} flex items-center justify-center`}
          >
            <Icon size={30} className="text-foreground w-12 h-12" />
          </div>
        </div>
      )}

      <h2 className="text-foreground font-bold text-3xl">
        {title || t("authModal.signUpToPost")}
      </h2>

      <p className="text-foreground text-sm leading-relaxed">
        {description || t("modal.joinThreads")}
      </p>

      <Button
        onClick={() => {

          onContinue();
          onClose();
        }}
        className="w-full bg-primary-foreground border cursor-pointer hover:!bg-transparent text-foreground justify-between py-6 rounded-xl"
      >
        <span>{buttonText || t("authModal.continueWithLogin")}</span>
        <span className="text-foreground">{">"}</span>
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer"
        />
        <Sheet
          modal={false}
          open={true}
          onOpenChange={(open) => !open && onClose()}
        >
          <SheetTitle className="hidden">Auth Modal</SheetTitle>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl p-0 bg-primary-foreground z-50"
          >
            <div className="text-center">{content}</div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <ModalPopup customModalClassName="w-120" onClose={onClose}>
      <Card className="bg-primary-foreground border-none text-center rounded-2xl shadow-xl">
        <CardContent>{content}</CardContent>
      </Card>
    </ModalPopup>
  );
};

export default AuthSocialModal;

