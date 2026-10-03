import type { PostTypeStatus } from "@/types/post";

const tabs = [
  { key: "ALL", label: "Tất cả" },
  { key: "ANNOUNCEMENT", label: "Thông báo" },
  { key: "WORKSPACE", label: "Không gian làm việc" },
] as const;

type FeedFilter = "ALL" | "WORKSPACE" | PostTypeStatus;

type FeedTabsProps = {
  value: FeedFilter;
  onChange: (value: FeedFilter) => void;
};

const FeedTabs: React.FC<FeedTabsProps> = ({ value, onChange }) => {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/95 px-5 pt-3.5 backdrop-blur">
      <div className="flex gap-[26px] overflow-x-auto text-[14.5px] font-semibold text-muted-foreground">
        {tabs.map((tab) => {
          const isActive = value === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative min-w-max pb-[13px] transition-colors ${isActive
                ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                : "hover:text-foreground/80"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeedTabs;
