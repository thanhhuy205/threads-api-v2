import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileLoading() {
  return (
    <div className="mx-auto max-w-[680px]">
      <div className="rounded-3xl bg-card px-5 py-5 md:p-8">
        <div className="space-y-5">
          <div className="grid grid-cols-[1fr_auto] items-start gap-4">
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="size-20 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-36 rounded-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
            </div>
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="mt-5 border-b border-border/60">
        <div className="flex items-center">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`user-profile-tab-skeleton-${index}`} className="flex-1 py-2.5">
              <Skeleton className="mx-auto h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`user-profile-post-skeleton-${index}`}
            className="border-b border-border px-6 py-3"
          >
            <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
