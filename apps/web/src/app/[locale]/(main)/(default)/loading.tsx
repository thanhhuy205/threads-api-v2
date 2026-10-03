import SkeletonPost from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonPost";

export default function DefaultRoutesLoading() {
  return (
    <div className="pt-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonPost key={index} />
      ))}
    </div>
  );
}
