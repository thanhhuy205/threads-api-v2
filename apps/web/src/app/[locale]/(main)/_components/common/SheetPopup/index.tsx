import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import PortalSheet from "../PortalSheet";

interface SheetPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  showHandle?: boolean;
  title?: string;
}

const SheetPopup = ({
  open,
  onOpenChange,
  children,
  className,
  showHandle = true,
  title,
}: SheetPopupProps) => {
  return (
    <PortalSheet>
      {open && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenChange(false);
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 "
        />
      )}

      <Sheet modal={false} open={open} onOpenChange={onOpenChange}>
        <SheetTitle className="hidden">{title ?? "SheetPopup"}</SheetTitle>
        <SheetContent
          aria-describedby={undefined}
          side="bottom"
          className={cn(
            "rounded-t-2xl p-0 bg-primary-foreground z-50",
            className
          )}
        >
          {showHandle && (
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-muted-foreground/50 rounded-full"></div>
            </div>
          )}

          <div className="text-foreground ">{children}</div>
        </SheetContent>
      </Sheet>
    </PortalSheet>
  );
};

export default SheetPopup;
