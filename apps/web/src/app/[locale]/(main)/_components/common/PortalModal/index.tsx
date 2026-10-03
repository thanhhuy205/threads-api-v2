import type { ReactNode } from "react";
import { createPortal } from "react-dom";

const PortalModal = ({ children }: { children: ReactNode }) => {
  const modalRoot = document.getElementById("modal-layer");
  if (!modalRoot) return null;
  return createPortal(children, modalRoot);
};

export default PortalModal;
