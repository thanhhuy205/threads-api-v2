"use client";

import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import HlsPlayer from "../../common/HlsPlayer";

type MediaItem = {
  id: number | null;
  url: string;
  type: string;
  width: number | null;
  height: number | null;
  status: string;
};

type PostMediaCarouselProps = {
  imageOffset: string;
  isStaticOrReply: boolean;
  mediaHeight: number;
  mediaUrls: string[];
  mediaWidth: number;
  medias?: MediaItem[];
  presentation?: "default" | "feed";
};

const isVideoUrl = (url: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v", ".3gp", ".m3u8"];
  const urlWithoutQuery = url.split("?")[0].toLowerCase();
  return videoExtensions.some((ext) => urlWithoutQuery.endsWith(ext)) || url.includes("video") || url.includes("stream.mux.com");
};

const stripMarginLeft = (cls: string) =>
  cls
    .split(" ")
    .filter((c) => !c.startsWith("ml-"))
    .join(" ");

export default function PostMediaCarousel({
  imageOffset,
  isStaticOrReply,
  mediaHeight,
  mediaUrls,
  mediaWidth,
  medias,
  presentation = "default",
}: PostMediaCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    watchDrag: !isStaticOrReply,
  });

  if (mediaUrls.length === 0) return null;

  // Prepare slides for Lightbox
  const slides = mediaUrls.map((url) => ({ src: url }));

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  // ─── Single media layout ───
  if (mediaUrls.length === 1) {
    const imageUrl = mediaUrls[0];
    if (!imageUrl) return null;
    const isVideo = isVideoUrl(imageUrl);
    const mediaItem = medias?.[0];
    const isUploading = mediaItem?.type === "VIDEO" && mediaItem?.status?.toUpperCase() !== "UPLOADED";

    return (
      <div className={presentation === "feed" ? "relative mt-3" : "relative mt-2"} onClick={(event) => event.stopPropagation()}>
        <div className={presentation === "feed" ? "" : stripMarginLeft(imageOffset)}>
          <div
            className={presentation === "feed" ? "block overflow-hidden rounded-lg" : "inline-block overflow-hidden rounded-lg"}
            style={{ maxWidth: presentation === "feed" ? "100%" : "480px" }}
          >
            {isUploading ? (
              <div
                className="flex flex-col items-center justify-center bg-neutral-900/95 text-white rounded-lg gap-3"
                style={{
                  width: "360px",
                  height: "270px",
                  maxWidth: "100%",
                }}
              >
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-sm font-semibold text-white/80">Đang tải video...</span>
              </div>
            ) : isVideo ? (
              <div className="overflow-hidden rounded-lg bg-muted/30 cursor-pointer">
                <HlsPlayer
                  src={imageUrl}
                  controls
                  className="block h-auto w-auto max-w-full rounded-lg max-h-[360px] object-contain"
                  onClick={(event) => {
                    event.stopPropagation();
                    openLightbox(0);
                  }}
                />
              </div>
            ) : (
              <img
                src={imageUrl}
                className={presentation === "feed"
                  ? "block max-h-[360px] w-full cursor-zoom-in rounded-lg object-cover transition-opacity hover:opacity-95"
                  : "block h-auto w-auto max-w-full rounded-lg cursor-zoom-in max-h-[360px] object-contain hover:opacity-95 transition-opacity"}
                alt=""
                onClick={() => openLightbox(0)}
              />
            )}
          </div>
        </div>

        {isOpen && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            index={photoIndex}
            slides={slides}
            plugins={[Zoom]}
            render={{
              slide: ({ slide }) => {
                if (isVideoUrl(slide.src)) {
                  return (
                    <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                      <HlsPlayer
                        src={slide.src}
                        controls
                        autoPlay
                        className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl"
                      />
                    </div>
                  );
                }
                return null;
              },
            }}
          />
        )}
      </div>
    );
  }

  if (presentation === "feed") {
    const visibleMedia = mediaUrls.slice(0, 4);

    return (
      <div className="relative mt-3" onClick={(event) => event.stopPropagation()}>
        <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-lg">
          {visibleMedia.map((imageUrl, index) => {
            const isVideo = isVideoUrl(imageUrl);
            const mediaItem = medias?.[index];
            const isUploading =
              mediaItem?.type === "VIDEO" &&
              mediaItem?.status?.toUpperCase() !== "UPLOADED";
            const remaining = mediaUrls.length - visibleMedia.length;

            return (
              <button
                type="button"
                key={imageUrl + index}
                className="relative h-[120px] overflow-hidden bg-muted"
                onClick={() => openLightbox(index)}
              >
                {isUploading ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-900/95 text-white">
                    <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    <span className="text-[10px] font-medium text-white/80">
                      Đang tải video...
                    </span>
                  </div>
                ) : isVideo ? (
                  <HlsPlayer
                    src={imageUrl}
                    controls={false}
                    className="h-full w-full object-cover pointer-events-none"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    className="h-full w-full object-cover transition-opacity hover:opacity-95"
                    alt=""
                  />
                )}

                {remaining > 0 && index === visibleMedia.length - 1 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-semibold text-white">
                    +{remaining}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isOpen && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            index={photoIndex}
            slides={slides}
            plugins={[Zoom]}
            render={{
              slide: ({ slide }) => {
                if (isVideoUrl(slide.src)) {
                  return (
                    <div className="flex h-full w-full items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                      <HlsPlayer
                        src={slide.src}
                        controls
                        autoPlay
                        className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
                      />
                    </div>
                  );
                }
                return null;
              },
            }}
          />
        )}
      </div>
    );
  }

  // ─── Multiple media (Carousel) ───
  return (
    <div className="relative mt-2" onClick={(event) => event.stopPropagation()}>
      <div className={`overflow-hidden w-auto ${imageOffset}`} ref={emblaRef}>
        <div className="flex gap-2">
          {mediaUrls.map((imageUrl, index) => {
            const isVideo = isVideoUrl(imageUrl);
            const mediaItem = medias?.[index];
            const isUploading = mediaItem?.type === "VIDEO" && mediaItem?.status?.toUpperCase() !== "UPLOADED";

            return (
              <div
                key={index}
                className="flex-none rounded-lg overflow-hidden bg-muted/30 select-none cursor-pointer"
                style={{
                  width: mediaWidth,
                  height: mediaHeight,
                }}
                onClick={() => openLightbox(index)}
              >
                {isUploading ? (
                  <div
                    className="flex flex-col items-center justify-center bg-neutral-900/95 text-white w-full h-full gap-2"
                  >
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-[10px] font-medium text-white/80">Đang tải video...</span>
                  </div>
                ) : isVideo ? (
                  <HlsPlayer
                    src={imageUrl}
                    controls={false}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                    alt=""
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          index={photoIndex}
          slides={slides}
          plugins={[Zoom]}
          render={{
            slide: ({ slide }) => {
              if (isVideoUrl(slide.src)) {
                return (
                  <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                    <HlsPlayer
                      src={slide.src}
                      controls
                      autoPlay
                      className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl"
                    />
                  </div>
                );
              }
              return null;
            },
          }}
        />
      )}
    </div>
  );
}
