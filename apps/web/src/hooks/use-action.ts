import { useRef, useState, type ChangeEvent } from "react";

export const useAction = () => {
  const [content, setContent] = useState("");
  const [previewImage, setPreviewImage] = useState<File[] | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPreviewImage(Array.from(files));
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImage((prev) => {
      if (!prev || index < 0 || index >= prev.length) return prev;
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : null;
    });
  };

  return {
    content,
    setContent,
    previewImage,
    handleInput,
    handleRemoveImage,
    inputRef,
    showEmoji,
    setShowEmoji,
  };
};
