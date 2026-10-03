import { Skeleton } from "@/app/[locale]/(main)/_components/common/Skeleton";

const SkeletonSearch = () => {
  return (
    <div className="flex gap-3 p-3 w-full bg-primary-foreground rounded-lg">
      <Skeleton variant="circular" className="w-8 h-8" />

      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1 w-full">
            <Skeleton variant="text" className="w-1/4 h-3" />
            <Skeleton variant="text" className="w-1/6 h-2" />
          </div>
          <Skeleton
            variant="rectangular"
            className="w-12 h-5 ml-2 rounded-md"
          />
        </div>

        <div className="space-y-1">
          <Skeleton variant="text" className="w-full h-2" />
          <Skeleton variant="text" className="w-11/12 h-2" />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton variant="circular" className="w-4 h-4 -ml-2" />
            <Skeleton variant="circular" className="w-4 h-4 -ml-2" />
          </div>
          <Skeleton variant="text" className="w-16 h-2 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonSearch;
