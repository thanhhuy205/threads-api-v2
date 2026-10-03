"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import SheetPopup from "../SheetPopup";

const AnimatedMenuContent = dynamic(() => import("./AnimatedMenuContent"), {
  ssr: false,
});

export type MenuItem = {
  label: string;
  icon?: ReactNode;
  isAuth?: boolean;
  isHeader?: boolean;
  className?: string;
  onClick?: () => void;
};

export type MotionPropsConfig = {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
};

interface MenuPopupProps {
  buttonActive: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  customPopup?: string;
  motionProps?: MotionPropsConfig;
  mode?: "short" | "long" | "medium";
  isMobilePopup?: boolean;
  items?: MenuItem[];
}

const MenuPopup = ({
  buttonActive,
  children,
  motionProps,
  className,
  customPopup,
  mode = "short",
  items,
}: MenuPopupProps) => {
  const { isAuthenticated } = useAuth();
  const sizeClasses = {
    short: "w-56 *:px-2",
    medium: "w-72 *:px-3",
    long: "w-96 *:px-4",
  };
  const [openSheet, setOpenSheet] = useState(false);
  const isMobile = useIsMobile();
  if (isMobile && items && items?.length >= 1) {
    return (
      <>
        <button
          className={cn(className)}
          onClick={(e) => {
            e.stopPropagation();
            setOpenSheet(true);
          }}
        >
          {buttonActive}
        </button>

        <SheetPopup
          title="MenuPopup"
          open={openSheet}
          onOpenChange={setOpenSheet}
        >
          <div className="p-2 space-y-1">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.onClick) {
                    item.onClick();
                    setOpenSheet(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-4 
       text-sm rounded-lg bg-background transition border ${
         item.isAuth ? (isAuthenticated !== item?.isAuth ? "hidden" : "") : ""
       }`}
              >
                <span className="font-semibold text-md">{item.label}</span>
                {item.icon}
              </button>
            ))}
          </div>
        </SheetPopup>
      </>
    );
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
        <Button className={className} variant="ghost">
          {buttonActive}
        </Button>
      </DropdownMenuTrigger>

      <AnimatedMenuContent
        customPopup={customPopup}
        isAuthenticated={isAuthenticated}
        items={items}
        motionProps={motionProps}
        sizeClassName={sizeClasses[mode] || sizeClasses.long}
      >
        {children}
      </AnimatedMenuContent>
    </DropdownMenu>
  );
};

export default MenuPopup;
