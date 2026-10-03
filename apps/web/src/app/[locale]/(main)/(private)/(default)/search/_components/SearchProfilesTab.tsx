"use client";

import { VerifiedIcon } from "@/app/[locale]/(main)/_components/common/Icon/VerifiedIcon";
import SkeletonSearch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonSearch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSearchUsernameQuery } from "@/features/search";
import { useDebounceSearch } from "@/hooks/use-debouce-search";
import type { SearchUsernameItem } from "@/types/search";

type SearchProfilesTabProps = {
  initialQuery?: string;
  query: string;
  isActive: boolean;
};

function SearchUserItem({ user }: { user: SearchUsernameItem }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-3.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-11">
          <AvatarImage src={user.avatar ?? ""} alt={user.username} />
          <AvatarFallback className="text-xs font-medium uppercase">
            {user.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate text-base font-semibold leading-none">
              {user.username}
            </p>
            {user.verifiedAt ? (
              <VerifiedIcon className="h-3.5 w-3.5 shrink-0 fill-sky-500" />
            ) : null}
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {user.name ?? `@${user.username}`}
          </p>
        </div>
      </div>

      <Button className="h-9 min-w-28 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:bg-black/90">
        Theo dõi
      </Button>
    </div>
  );
}

export default function SearchProfilesTab({
  query,
  isActive,
}: SearchProfilesTabProps) {
  const value = useDebounceSearch({ query });
  const hasQuery = Boolean(value.trim());
  const shouldFetch = isActive && hasQuery;
  const isDebouncing = isActive && query.trim() !== value.trim();

  const { data, isLoading } = useSearchUsernameQuery({
    query: { q: value },
    options: {
      enabled: shouldFetch,
      staleTime: 30_000,
    },
  });

  const users = data?.data ?? [];

  if (!isActive) return null;

  if (isDebouncing || (isLoading && !data)) {
    return (
      <div className="space-y-3 rounded-lg bg-muted/30 text-muted-foreground text-center">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonSearch key={`search-user-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="rounded-2xl border border-border bg-primary-foreground px-4 py-10 text-center text-sm text-muted-foreground">
        Không tìm thấy tài khoản phù hợp.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-primary-foreground">
      {users.map((user) => (
        <SearchUserItem key={user.id} user={user} />
      ))}
    </div>
  );
}
