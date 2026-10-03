import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import type { ReactNode } from "react";

interface ThemeMenuItem {
    label?: string;
    icon?: ReactNode;
    value?: "light" | "dark" | "system";
    onClick?: () => void;
}

interface ThemeMenuProps {
    title?: string;
    onClick?: () => void;
    items: ThemeMenuItem[];
}

export function ThemeMenu({
    title = "Appearance",
    onClick,
    items,
}: ThemeMenuProps) {
    const { theme: currentTheme } = useTheme();

    return (
        <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={onClick}
                    className="p-2 rounded-full hover:bg-accent transition"
                >
                    <ArrowLeft size={20} />
                </button>

                <h2 className="text-base font-semibold">{title}</h2>
            </div>

            <div className="bg-muted rounded-2xl flex p-1 gap-1 select-none">
                {items.map((item, index) => {
                    const isActive = currentTheme === item.value;

                    return (
                        <button
                            key={index}
                            onClick={() => {
                                item.onClick?.();
                                if (onClick) onClick();
                            }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary-foreground shadow-sm text-foreground"
                                    : "opacity-60 hover:opacity-100"
                            )}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {isActive && <Check size={13} strokeWidth={2.5} />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
