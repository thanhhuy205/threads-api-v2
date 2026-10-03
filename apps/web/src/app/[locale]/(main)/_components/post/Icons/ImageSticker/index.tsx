import { forwardRef } from "react";

interface ImageStickerProps {
  className?: string;
  onClick?: () => void;
}

const ImageSticker = forwardRef<SVGSVGElement, ImageStickerProps>(
  ({ className, onClick }, ref) => {
    return (
      <svg
        ref={ref}
        aria-label="Thêm biểu tượng cảm xúc"
        role="img"
        viewBox="0 0 24 24"
        className={
          className ||
          "x1lliihq x2lah0s x1n2onr6 x19zyb68 x16ye13r x5lhr3w x1gaogpn x73je2i x1owpc8m x1ns0lul"
        }
        style={{ fill: "currentColor", height: "20px", width: "20px" }}
        onClick={onClick}
      >
        <title>Thêm biểu tượng cảm xúc</title>
        <circle
          cx="12"
          cy="12"
          fill="none"
          r="9.25"
          stroke="currentColor"
          strokeWidth="1.5"
        ></circle>
        <circle cx="16" cy="12" fill="currentColor" r="1"></circle>
        <circle cx="8" cy="12" fill="currentColor" r="1"></circle>
        <path
          d="M9 15V15C10.3589 17.2648 13.6411 17.2648 15 15V15"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        ></path>
      </svg>
    );
  }
);

ImageSticker.displayName = "ImageSticker";

export default ImageSticker;
