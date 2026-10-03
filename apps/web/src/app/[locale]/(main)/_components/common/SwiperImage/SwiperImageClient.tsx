"use client";

import useEmblaCarousel from "embla-carousel-react";
import { X } from "lucide-react";
import MediumZoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type { SwiperImageProps } from ".";
import HlsPlayer from "../HlsPlayer";

const isFileVideo = (file: File | string) => {
  if (file instanceof File) {
    return file.type.startsWith("video/");
  }
  if (typeof file === "string") {
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".mov",
      ".m4v",
      ".3gp",
      ".m3u8",
    ];
    const urlWithoutQuery = file.split("?")[0].toLowerCase();
    return (
      videoExtensions.some((ext) => urlWithoutQuery.endsWith(ext)) ||
      file.includes("video") ||
      file.includes("stream.mux.com")
    );
  }
  return false;
};

export default function SwiperImageClient({
  images,
  className,
  onRemove,
  sizeMode = "fixed",
}: SwiperImageProps) {
  const isNaturalSize = sizeMode === "natural";
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  return (
    <div className={`relative mt-3 w-full overflow-hidden ${className || ""}`}>
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2">
          {images.map((item, index) => {
            const url =
              typeof item === "string" ? item : URL.createObjectURL(item);
            const isVideo = isFileVideo(item);

            return (
              <div
                key={index}
                className={`flex-none overflow-hidden select-none`}
                style={{ width: isNaturalSize ? "auto" : "210px" }}
              >
                <div
                  className={`relative rounded-lg overflow-hidden ${
                    isNaturalSize
                      ? "inline-flex max-h-[280px] max-w-[210px] items-center justify-center bg-muted/20"
                      : "h-[280px] w-[210px]"
                  }`}
                >
                  {onRemove ? (
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemove(index);
                      }}
                      className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  ) : null}
                  {isVideo ? (
                    <HlsPlayer
                      src={url}
                      controls
                      className={
                        isNaturalSize
                          ? "block h-auto max-h-[280px] w-auto max-w-[210px] object-contain"
                          : "h-full w-full object-cover"
                      }
                    />
                  ) : (
                    <MediumZoom zoomMargin={40}>
                      <img
                        src={url}
                        className={`cursor-zoom-in ${
                          isNaturalSize
                            ? "block h-auto max-h-[280px] w-auto max-w-[210px] object-contain"
                            : "h-full w-full object-cover"
                        }`}
                        alt=""
                      />
                    </MediumZoom>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
