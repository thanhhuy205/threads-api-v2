import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import styles from "../../item-setting.module.css";

const ExternalLinkItem = ({
    text,
    onClick,
}: {
    text: string | ReactNode;
    onClick?: () => void;
}) => {
    return (
        <Button variant="ghost" className={styles.menuItemBase} onClick={onClick}>
            <span className="text-foreground text-sm">{text}</span>
            <ExternalLink className={styles.menuItemIconRight} />
        </Button>
    );
};

export default ExternalLinkItem;