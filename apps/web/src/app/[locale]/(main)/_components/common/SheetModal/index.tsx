import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface SheetModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  mode?: "auto" | "fit";
}
const SheetModal = ({
  open,
  onClose,
  children,
  className,
  mode = "auto",
}: SheetModalProps) => {
  const heightClass = mode === "fit" ? "h-auto max-h-[90vh]" : "h-[100vh]";

  return (
    <>
      {mode === "fit" ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 "
        />
      ) : (
        ""
      )}
      <Sheet modal={false} open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetTitle className="hidden">PulseBoard</SheetTitle>

        <SheetContent
          aria-describedby={undefined}
          side="bottom"
          className={`${heightClass} p-0 overflow-hidden ${className}`}
        >
          <div className="h-full overflow-y-auto border-none !border-0 !shadow-none rounded-none [&_*]:border-none [&_*]:shadow-none">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SheetModal;
