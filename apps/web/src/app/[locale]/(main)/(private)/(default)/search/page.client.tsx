"use client";

import { Input } from "@/components/ui/input";
import { useDebounceSearch } from "@/hooks/use-debouce-search";
import type {
  SearchPostsResponse,
  SearchUsernameResponse,
} from "@/types/search";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import SearchPostsTab from "./_components/SearchPostsTab";
import SearchProfilesTab from "./_components/SearchProfilesTab";
import { cn } from "@/lib/utils";

type SearchHeroTab = "default" | "profiles";

type SearchPageClientProps = {
  initialPosts?: SearchPostsResponse | null;
  initialProfiles?: SearchUsernameResponse | null;
};

const SEARCH_HERO_TABS: Array<{ key: SearchHeroTab; label: string }> = [
  { key: "default", label: "Liên quan nhất" },
  { key: "profiles", label: "Trang cá nhân" },
];

// ─── Mock data ────────────────────────────────────────────────────────────────

const TRENDING_CHIPS = [
  "Canadian PulseBoard",
  "thi tốt nghiệp",
  "Thi tốt nghiệp THPT",
  "phân biệt chủng tộc",
  "hoài lâm",
  "AI tổng hợp",
  "PulseBoard mới",
];

const TRENDING_TOPICS = [
  {
    id: 1,
    title: "Kiều Anh ra mắt MV mới",
    description:
      "Ca nương Kiều Anh phát hành MV ballad mới vào tối 15/06 · 255K bài viết",
    thumbnail: null,
  },
  {
    id: 2,
    title: "MaRin: Bể tướng Gumayusi hạn chế",
    description:
      "MaRin cho rằng bể tướng của Gumayusi còn hạn chế, chỉ chơi hiệu quả một số tướng · 3K bài viết",
    thumbnail: null,
  },
  {
    id: 3,
    title: "LYHAN tái xuất sự kiện",
    description:
      "Ca sĩ LYHAN được khen ngợi nhan sắc khi tái xuất tại tiệc sinh nhật chủ tịch DatVietVAC",
    thumbnail: null,
  },
  {
    id: 4,
    title: "GrabFood giảm giá đến 50%",
    description:
      "GrabFood tung nhiều mã giảm giá đến 50% vào các khung giờ nhất định trong ngày · 609K bài viết",
    thumbnail: null,
  },
  {
    id: 5,
    title: "Fan mừng sinh nhật Lamoon",
    description:
      "Fan thực hiện dự án Lamoon's Legacy để chúc mừng sinh nhật nữ ca sĩ",
    thumbnail: null,
  },
];

const MOCK_SUGGESTIONS = [
  {
    id: "1",
    username: "tnhng05",
    name: "My Thanh",
    bio: "💌 : tnhngw@gmail.com\nO85.887.bar926",
    followersCount: 104,
    avatarUrl: "",
    verified: false,
  },
  {
    id: "2",
    username: "rpt.mckeyyyyy",
    name: "Nguyễn Ivan",
    bio: "🐎🐎🐎🐎🐎🐎🐎",
    followersCount: 284000,
    avatarUrl: "",
    verified: true,
  },
  {
    id: "3",
    username: "linh.creative",
    name: "Linh Creative",
    bio: "Designer & Content Creator ✨",
    followersCount: 12300,
    avatarUrl: "",
    verified: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendingChips() {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
      {TRENDING_CHIPS.map((chip) => (
        <button
          key={chip}
          className="shrink-0 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground whitespace-nowrap hover:bg-muted/60 transition-colors"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

function TrendingSection() {
  return (
    <div className="mt-4">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-foreground">
          <span className="bg-yellow-300 text-foreground px-1 rounded">
            Đang thịnh hành
          </span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Những gì mọi người đang bàn luận, do AI tóm tắt
        </p>
      </div>

      <div className="divide-y divide-border">
        {TRENDING_TOPICS.map((topic) => (
          <button
            key={topic.id}
            className="w-full flex items-center gap-3 py-3 text-left hover:bg-muted/20 transition-colors -mx-4 px-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm leading-snug">
                {topic.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                {topic.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MockSuggestionItem({
  user,
}: {
  user: (typeof MOCK_SUGGESTIONS)[number];
}) {
  const [following, setFollowing] = useState(false);

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="shrink-0 w-11 h-11 rounded-full bg-muted/60 flex items-center justify-center text-base font-semibold text-foreground overflow-hidden">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          user.username.slice(0, 2).toUpperCase()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm text-foreground">
            {user.username}
          </span>
          {user.verified && (
            <svg
              viewBox="0 0 40 40"
              className="w-3 h-3 shrink-0"
              style={{ fill: "rgb(0, 149, 246)" }}
            >
              <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" />
            </svg>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{user.name}</p>
        <p className="text-xs text-foreground/80 mt-0.5 whitespace-pre-line line-clamp-2">
          {user.bio}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatCount(user.followersCount)} người theo dõi
        </p>
      </div>

      <button
        onClick={() => setFollowing((f) => !f)}
        className={cn(
          "shrink-0 mt-1 rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
          following
            ? "border border-border bg-background text-foreground hover:bg-muted/40"
            : "bg-foreground text-background hover:opacity-80",
        )}
      >
        {following ? "Đang theo dõi" : "Theo dõi"}
      </button>
    </div>
  );
}

function SearchEmptyState() {
  return (
    <div className="rounded-xl bg-primary-foreground overflow-hidden">
      <div className="p-4">
        <TrendingChips />
        <TrendingSection />
      </div>

      <div className="border-t border-border p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-1">
          Gợi ý theo dõi
        </h3>
        {MOCK_SUGGESTIONS.map((user) => (
          <MockSuggestionItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SearchPageClient({
  initialPosts,
  initialProfiles,
}: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentQueryParam = searchParams?.get("q") ?? "";
  const currentFilter = searchParams?.get("filter");
  const activeTab: SearchHeroTab =
    currentFilter === "profiles" ? "profiles" : "default";

  const [queryState, setQueryState] = useState({
    key: currentQueryParam,
    value: currentQueryParam,
  });
  const query =
    queryState.key === currentQueryParam ? queryState.value : currentQueryParam;
  const setQuery = (value: string) => {
    setQueryState({ key: currentQueryParam, value });
  };
  const debouncedQuery = useDebounceSearch({ query });
  const [, startTransition] = useTransition();
  const t = useTranslations();
  const hasQuery = Boolean(query.trim());

  const buildSearchHref = useCallback(
    ({ q, tab }: { q: string; tab: SearchHeroTab }) => {
      const params = new URLSearchParams(searchParams?.toString());
      const normalizedQuery = q.trim();

      if (normalizedQuery) {
        params.set("q", normalizedQuery);
        params.set("serp_type", "default");
      } else {
        params.delete("q");
        params.delete("serp_type");
      }

      if (tab === "profiles") {
        params.set("filter", "profiles");
      } else {
        params.delete("filter");
      }

      const nextQueryString = params.toString();
      return nextQueryString ? `${pathname}?${nextQueryString}` : pathname;
    },
    [pathname, searchParams],
  );

  useEffect(() => {
    if (debouncedQuery.trim() === currentQueryParam.trim()) return;

    startTransition(() => {
      void router.replace(
        buildSearchHref({
          q: debouncedQuery,
          tab: activeTab,
        }),
        { scroll: false },
      );
    });
  }, [
    activeTab,
    buildSearchHref,
    currentQueryParam,
    debouncedQuery,
    router,
    startTransition,
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] items-start gap-6">
      <div className="min-w-0 flex-1">
        <div className="top-0 z-10 border-b bg-primary-foreground border-border">
          <div className="p-4 mx-auto">
          <div className="relative">
            <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder={t("search.placeholder")}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="pl-10 pr-10 rounded-lg h-11 bg-muted/50 focus:bg-private focus:outline-none focus:ring-0"
            />
            {query ? (
              <button
                onClick={() => {
                  setQuery("");
                }}
                className="absolute -translate-y-1/2 right-3 top-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        </div>
        </div>

        <div className="max-w-2xl p-4 pb-20 mx-auto">
          {hasQuery ? (
            <>
              <div className="mb-4 overflow-hidden rounded-2xl bg-primary-foreground">
                <div className="grid grid-cols-2">
                  {SEARCH_HERO_TABS.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => {
                          void router.push(
                            buildSearchHref({ q: query, tab: tab.key }),
                          );
                        }}
                        className={
                          isActive
                            ? "px-3 py-4 text-sm font-semibold text-foreground"
                            : "px-3 py-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
                        }
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mb-4 text-sm text-muted-foreground">
                Kết quả cho &quot;
                <span className="font-medium text-foreground">{query}</span>&quot;
              </p>

              <SearchPostsTab
                query={query}
                isActive={activeTab === "default"}
                initialPage={initialPosts}
                initialQuery={currentQueryParam}
              />
              <SearchProfilesTab
                query={query}
                isActive={activeTab === "profiles"}
              />
            </>
          ) : (
            <SearchEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
