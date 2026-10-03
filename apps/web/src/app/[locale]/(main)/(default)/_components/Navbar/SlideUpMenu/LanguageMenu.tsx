import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { type ReactNode } from "react";

interface LanguageMenuItem {
    label: string;
    value?: string;
    icon?: ReactNode;
    onClick?: () => void;
}

interface LanguageMenuProps {
    items: LanguageMenuItem[];
    onClick: () => void;
}

export function LanguageMenu({ items, onClick }: LanguageMenuProps) {
    const locale = useLocale();

    return (
        <>
            {items.map((item) => {
                const isActive = item.value === locale;

                return (
                    <DropdownMenuItem
                        key={item.value}
                        onSelect={(e) => {
                            e.preventDefault();
                            item.onClick?.();
                            if (onClick) onClick();
                        }}
                        className={cn(
                            "flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                            isActive ? "bg-accent text-accent-foreground" : ""
                        )}
                    >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        {isActive && <Check size={14} strokeWidth={2.5} className="text-foreground" />}
                    </DropdownMenuItem>
                );
            })}
        </>
    );
}
