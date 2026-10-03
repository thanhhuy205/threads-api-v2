import React from "react";

type SkeletonVariant = "text" | "circular" | "rectangular";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  className = "",
  width,
  height,
}) => {
  const baseClasses = "animate-pulse flex-shrink-0";

  const variantClasses: Record<SkeletonVariant, string> = {
    circular: "rounded-full",
    rectangular: "rounded-lg",
    text: "rounded-md h-4",
  };

  return (
    <div
      className={`${baseClasses} bg-foreground/20 ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};
