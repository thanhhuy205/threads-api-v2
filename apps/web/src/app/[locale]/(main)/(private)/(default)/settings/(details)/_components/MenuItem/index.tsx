import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import styles from "../item-setting.module.css";

const MenuItem = ({
    icon,
    text,
    badge,
    hasArrow = true,
    onClick,
    className,
}: {
    icon?: ReactNode;
    text: string | ReactNode;
    badge?: ReactNode;
    hasArrow?: boolean;
    onClick?: () => void;
    className?: string;
}) => {
    return (
        <Button
            variant="ghost"
            className={`${styles.menuItemBase} ${className ?? ""}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 text-foreground">
                {icon}
                <span className="text-foreground">{text}</span>
            </div>

            <div className="flex items-center gap-2">
                {badge}
                {hasArrow && <ChevronRight className={styles.menuItemIconRight} />}
            </div>
        </Button>
    );
};

export default MenuItem;