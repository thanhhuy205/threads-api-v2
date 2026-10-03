import { createPortal } from "react-dom";

const EmojiPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === "undefined") return null;

  return createPortal(children, document.body);
};

export default EmojiPortal;
