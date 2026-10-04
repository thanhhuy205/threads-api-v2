import { Input } from "@/components/ui/input";
import {
  BriefcaseBusiness,
  CheckCircle2,
  LockKeyhole,
  Search,
  UsersRound,
} from "lucide-react";

const tabs = [
  { key: "LATEST", label: "Latest" },
  { key: "ANNOUNCEMENT", label: "Announcements" },
  { key: "PINNED", label: "Pinned" },
] as const;

export type FeedFilter = (typeof tabs)[number]["key"];

type FeedTabsProps = {
  value: FeedFilter;
  onChange: (value: FeedFilter) => void;
  query: string;
  onQueryChange: (value: string) => void;
};

const FeedTabs: React.FC<FeedTabsProps> = ({
  value,
  onChange,
  query,
  onQueryChange,
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white">
      <div className="relative h-[190px] overflow-hidden bg-[#f1f7fa]">
        <div className="absolute -left-16 -top-20 size-64 rounded-full border-[32px] border-[#ff9f5a]/75" />
        <div className="absolute -bottom-28 left-36 size-72 rounded-full border-[38px] border-[#83b7f4]/55" />
        <div className="absolute -right-12 -top-24 size-72 rounded-full border-[36px] border-[#f39775]/65" />
        <div className="absolute bottom-[-92px] right-36 size-60 rounded-full border-[30px] border-[#68c4bc]/55" />

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="relative flex w-full max-w-[620px] items-center justify-between gap-5 rounded-2xl border border-white/90 bg-white/80 px-5 py-4 shadow-[0_18px_50px_rgba(31,42,55,0.10)] backdrop-blur-md">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#eff0fd] px-2.5 py-1 text-[11px] font-semibold text-[#6369ec]">
                <LockKeyhole className="size-3" /> Members only
              </div>
              <p className="text-lg font-semibold tracking-[-0.025em] text-[#0d121c] sm:text-xl">
                The Founders&apos; Room
              </p>
              <p className="mt-1 text-xs text-[#6c737f] sm:text-sm">
                Decisions, lessons and opportunities shared in confidence.
              </p>
            </div>
            <div className="relative hidden size-20 shrink-0 items-center justify-center rounded-2xl bg-[#0d121c] text-white sm:flex">
              <BriefcaseBusiness className="size-8" />
              <CheckCircle2 className="absolute -bottom-1.5 -right-1.5 size-6 rounded-full bg-white fill-[#61d6a8] text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[110px] items-start justify-between gap-5 border-b border-[#f3f4f6] px-5 py-4 sm:px-6">
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.025em] text-[#0d121c] sm:text-2xl">
            Private Business Community
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#6c737f]">
            Kết nối cùng những founder và operator đã được xác thực. Chia sẻ thật,
            học hỏi sâu và cùng nhau mở ra những cơ hội hợp tác chất lượng.
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 rounded-lg bg-[#f9fafb] px-3 py-2 text-xs font-medium text-[#4d5761] sm:flex">
          <UsersRound className="size-4 text-[#1a84a3]" />
          128 members
        </div>
      </div>

      <div className="flex min-h-[52px] items-center gap-3 px-5 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-6 overflow-x-auto text-sm font-medium text-[#6c737f]">
          {tabs.map((tab) => {
            const isActive = value === tab.key;

            return (
              <button
                type="button"
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`relative min-w-max py-4 transition-colors ${
                  isActive
                    ? "font-semibold text-[#0d121c] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#1a84a3]"
                    : "hover:text-[#0d121c]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <label className="relative hidden w-56 shrink-0 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search conversations"
            className="h-9 rounded-full border-[#f3f4f6] bg-[#fafbfc] pl-9 text-sm shadow-none"
          />
        </label>
      </div>
    </section>
  );
};

export default FeedTabs;
