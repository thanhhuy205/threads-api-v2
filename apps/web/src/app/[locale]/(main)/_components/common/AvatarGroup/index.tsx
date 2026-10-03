import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AvatarGroupProps = {
  size?: number;
  classNameFallback?: string;
  url: string;
  fallBack?: string;
  className?: string;
};

const AVATAR_SIZE_CLASS_NAMES: Record<number, string> = {
  4: "size-4",
  6: "size-6",
  8: "size-8",
  10: "size-10",
  12: "size-12",
  14: "size-14",
  20: "size-20",
};

export const getAvatarGroupSizeClassName = (size = 10) =>
  AVATAR_SIZE_CLASS_NAMES[size] ?? "size-10";

const AvatarGroup = ({
  size = 10,
  url,
  fallBack = "AN",
  classNameFallback,
  className,
}: AvatarGroupProps) => {
  return (
    <>
      <Avatar
        className={cn(getAvatarGroupSizeClassName(size), "shrink-0", className)}
      >
        <AvatarImage className="object-cover" src={url} />
        <AvatarFallback className={classNameFallback}>
          {fallBack}
        </AvatarFallback>
      </Avatar>
    </>
  );
};

export default AvatarGroup;
