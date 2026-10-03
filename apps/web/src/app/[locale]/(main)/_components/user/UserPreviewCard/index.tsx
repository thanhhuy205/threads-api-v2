import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import type { MappedUser } from "@/app/[locale]/(main)/_components/post/type";
import { useMemo } from "react";

interface UserPreviewCardProps {
  user: MappedUser;
}

const getInitials = (username: string) => {
  const normalized = username.trim().toUpperCase();
  if (!normalized) return "AN";
  return normalized.slice(0, 2);
};

export default function UserPreviewCard({
  user,
}: UserPreviewCardProps) {
  const displayName = useMemo(() => {
    const normalizedName = user?.name?.trim();
    return normalizedName || user?.username || "Unknown user";
  }, [user?.name, user?.username]);

  if (!user) return null;

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className="absolute top-7 z-50 w-[320px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-border bg-background p-4 shadow-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">
            {displayName}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            @{user.username}
          </p>
        </div>

        <AvatarGroup
          classNameFallback="border bg-muted"
          size={20}
          url={user.avatarUrl ?? ""}
          fallBack={getInitials(user.username ?? "")}
        />
      </div>

      {user.bio ? (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/90">
          {user.bio}
        </p>
      ) : null}
    </div>
  );
}
