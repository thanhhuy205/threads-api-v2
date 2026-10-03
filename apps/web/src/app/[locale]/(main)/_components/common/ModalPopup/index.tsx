"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import SheetModal from "../SheetModal";

const AnimatedModalSurface = dynamic(() => import("../AnimatedModalSurface"), {
  ssr: false,
});

interface ModalPopupProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  customModalClassName?: string;
  mode?: "subtract" | "auto" | "custom";
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  lockScroll?: boolean;
  title?: string;
  isMobileSheet?: boolean;
  modeSheet?: "auto" | "fit";
}

const ModalPopup = ({
  children,
  onClose,
  title,
  className,
  customModalClassName,
  mode = "auto",
  closeOnBackdropClick = true,
  isMobileSheet = true,
  modeSheet = "auto",
}: ModalPopupProps) => {
  const isMobile = useIsMobile();

  if (isMobile && isMobileSheet) {
    return (
      <SheetModal mode={modeSheet} open={true} onClose={onClose} title={title}>
        {children}
      </SheetModal>
    );
  }

  return (
    <AnimatedModalSurface
      className={className}
      closeOnBackdropClick={closeOnBackdropClick}
      customModalClassName={customModalClassName}
      mode={mode}
      onClose={onClose}
    >
      {children}
    </AnimatedModalSurface>
  );
};

export default ModalPopup;
