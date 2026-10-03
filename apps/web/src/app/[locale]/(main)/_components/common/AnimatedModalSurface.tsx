"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import PortalModal from "./PortalModal";

type AnimatedModalSurfaceProps = {
  children: ReactNode;
  className?: string;
  closeOnBackdropClick: boolean;
  customModalClassName?: string;
  mode: "subtract" | "auto" | "custom";
  onClose: () => void;
};

export default function AnimatedModalSurface({
  children,
  className,
  closeOnBackdropClick,
  customModalClassName,
  mode,
  onClose,
}: AnimatedModalSurfaceProps) {
  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdropClick) {
      onClose();
      event.stopPropagation();
    }
  };

  return (
    <PortalModal>
      <motion.div
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "fixed inset-0 bg-black/50 flex items-center pt-[10vh] justify-center z-50",
          className,
          mode === "subtract" && "block absolute bg-transparent",
        )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={
            mode === "custom"
              ? customModalClassName ?? ""
              : cn(
                  "w-full max-w-[630px] bg-background rounded-3xl mb-20 text-foreground shadow-xl border-none sm:border z-50",
                  customModalClassName,
                )
          }
        >
          {children}
        </motion.div>
      </motion.div>
    </PortalModal>
  );
}
