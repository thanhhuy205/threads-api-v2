import SkeletonPost from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonPost";

export default function PrivateDefaultLoading() {
  return (
    <div className="bg-primary-foreground">
      <div className="border-b border-border p-4">
        <div className="h-5 w-40 rounded bg-muted" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonPost key={index} />
      ))}
    </div>
  );
}
