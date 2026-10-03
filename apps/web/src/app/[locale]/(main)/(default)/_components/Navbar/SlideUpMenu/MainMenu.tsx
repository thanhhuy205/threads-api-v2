import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface MenuItem {
    label: string;
    danger?: boolean;
    onClick?: () => void;
    icon?: ReactNode;
    pathName?: string;
    isAuth?: boolean;
}

interface MainMenuProps {
    items: MenuItem[];
}

export function MainMenu({ items }: MainMenuProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    return (
        <>
            {items.map((item, index) => (
                <DropdownMenuItem
                    key={index}
                    onSelect={(e) => {
                        if (!item.pathName) {
                            e.preventDefault();
                            item.onClick?.();
                        } else {
                            router.push("/" + item.pathName);
                        }
                    }}
                    className={cn(
                        "cursor-pointer px-3 py-2 text-sm transition-colors",
                        item.isAuth && isAuthenticated !== item.isAuth ? "hidden" : "",
                        item.danger
                            ? "text-red-500 hover:bg-red-500/10 hover:text-red-600"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {item.label}{" "}
                    {item?.icon && <span className="ml-auto">{item.icon}</span>}
                </DropdownMenuItem>
            ))}
        </>
    );
}
