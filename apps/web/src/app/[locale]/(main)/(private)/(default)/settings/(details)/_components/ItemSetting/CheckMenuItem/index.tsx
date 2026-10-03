import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import styles from "../../item-setting.module.css";

const CheckboxMenuItem = ({
    text,
    description,
    checked = false,
    onChange,
}: {
    text: string;
    description?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}) => {
    return (
        <Button
            variant="ghost"
            className={styles.menuItemBase}
            onClick={() => onChange?.(!checked)}
        >
            <div className="flex flex-col items-start gap-1">
                <span className="text-foreground">{text}</span>
                {description && (
                    <span className={styles.menuItemDescription}>{description}</span>
                )}
            </div>

            {checked && (
                <div className={styles.menuItemCheckWrapper}>
                    <Check className={styles.menuItemCheckIcon} />
                </div>
            )}
        </Button>
    );
};

export default CheckboxMenuItem;