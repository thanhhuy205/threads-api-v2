"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { MenuItem, MotionPropsConfig } from ".";

type AnimatedMenuContentProps = {
  children?: ReactNode;
  customPopup?: string;
  isAuthenticated: boolean;
  items?: MenuItem[];
  motionProps?: MotionPropsConfig;
  sizeClassName: string;
};

export default function AnimatedMenuContent({
  children,
  customPopup,
  isAuthenticated,
  items,
  motionProps,
  sizeClassName,
}: AnimatedMenuContentProps) {
  return (
    <DropdownMenuContent
      asChild
      sideOffset={8}
      onCloseAutoFocus={(event) => event.preventDefault()}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: -4,
          ...(motionProps?.initial || {}),
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          ...(motionProps?.animate || {}),
        }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
          ...(motionProps?.transition || {}),
        }}
        className={`
            h-fit
              rounded-xl border border-gray-200 p-2 bg-primary-foreground 
              *:text-[15px] *:py-3 *:font-semibold *:rounded-xl shadow-lg
              ${sizeClassName}
              ${customPopup || ""}
          `}
      >
        {items && items.length > 0
          ? items.map((item, index) => (
              <DropdownMenuItem
                key={index}
                className={`flex items-center justify-between gap-2 ${
                  item?.isAuth
                    ? isAuthenticated !== item.isAuth
                      ? "hidden"
                      : ""
                    : ""
                } `}
                onClick={(event) => {
                  event.stopPropagation();
                  if (item.onClick) {
                    item.onClick();
                  }
                }}
              >
                <span>{item.label}</span>
                {item.icon}
              </DropdownMenuItem>
            ))
          : children}
      </motion.div>
    </DropdownMenuContent>
  );
}

