import { Skeleton } from "@/app/[locale]/(main)/_components/common/Skeleton";

const SkeletonPost = () => {
  return (
    <div className="border border-border rounded-xl bg-background shadow-sm px-5 py-4 mb-3 mx-3 animate-pulse">
      {/* Type badge */}
      <div className="mb-3">
        <Skeleton variant="rectangular" className="h-5 w-24 rounded-full" />
      </div>

      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="circular" className="size-9 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton variant="text" className="w-32 h-3.5" />
          <Skeleton variant="text" className="w-20 h-3" />
        </div>
        {/* Menu dot */}
        <Skeleton variant="circular" className="size-6" />
      </div>

      {/* Title */}
      <Skeleton variant="text" className="w-3/4 h-5 mb-2" />

      {/* Body lines */}
      <div className="space-y-1.5 mb-4">
        <Skeleton variant="text" className="w-full h-3.5" />
        <Skeleton variant="text" className="w-[90%] h-3.5" />
        <Skeleton variant="text" className="w-2/3 h-3.5" />
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4 pt-2 border-t border-border/50">
        <Skeleton variant="rectangular" className="h-6 w-16 rounded-full" />
        <Skeleton variant="rectangular" className="h-6 w-24 rounded-full" />
        <span className="flex-1" />
        <Skeleton variant="rectangular" className="h-6 w-12 rounded-full" />
        <Skeleton variant="rectangular" className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonPost;
