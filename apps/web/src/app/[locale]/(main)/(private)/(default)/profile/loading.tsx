import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="h-full px-4 pt-8 pb-10 md:px-6">
      <div className="mx-auto max-w-[620px]">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="size-12 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />

            <div className="flex items-center gap-2">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-9 w-full rounded-xl" />
        </div>

        <div className="mt-8 border-b border-border/40">
          <div className="flex items-center">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-1 py-3">
                <Skeleton className="mx-auto h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-12" />
            </div>

            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="min-w-[250px] flex-1 rounded-2xl border border-border/70 p-4"
                >
                  <Skeleton className="mx-auto size-12 rounded-full" />
                  <Skeleton className="mx-auto mt-4 h-5 w-36" />
                  <Skeleton className="mx-auto mt-2 h-4 w-full" />
                  <Skeleton className="mx-auto mt-2 h-4 w-3/4" />
                  <Skeleton className="mx-auto mt-6 h-9 w-28 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex gap-3 border-b border-border/40 pb-4">
                <Skeleton className="size-10 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
