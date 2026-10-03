"use client";

import dynamic from "next/dynamic";

export interface SwiperImageProps {
  images: File[] | string[];
  className?: string;
  onRemove?: (index: number) => void;
  sizeMode?: "fixed" | "natural";
}

const SwiperImageClient = dynamic(() => import("./SwiperImageClient"), {
  ssr: false,
  loading: () => <div className="mt-3 h-[280px] w-full rounded-lg bg-muted/20" />,
});

export default function SwiperImage(props: SwiperImageProps) {
  return <SwiperImageClient {...props} />;
}
