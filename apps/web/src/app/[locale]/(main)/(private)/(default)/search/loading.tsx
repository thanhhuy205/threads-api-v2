import SkeletonSearch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonSearch";

export default function SearchLoading() {
  return (
    <>
      <div className="border-b bg-primary-foreground p-4">
        <div className="h-11 rounded-lg bg-muted/50" />
      </div>
      <div className="mx-auto max-w-2xl space-y-3 p-4 pb-20">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonSearch key={index} />
        ))}
      </div>
    </>
  );
}
