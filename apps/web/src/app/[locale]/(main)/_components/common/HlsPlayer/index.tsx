"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export default function HlsPlayer({ src, className, ...props }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (src.includes(".m3u8")) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari, iOS Safari, macOS browsers)
        video.src = src;
      } else if (Hls.isSupported()) {
        // Hls.js support for Chrome, Firefox, Edge, etc.
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        console.error("This browser does not support HLS");
      }
    } else {
      // Normal video / Blob URL preview
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      {...props}
    />
  );
}
