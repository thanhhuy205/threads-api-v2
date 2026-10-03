import type { ReactNode } from "react";
import { createPortal } from "react-dom";

const PortalSheet = ({ children }: { children: ReactNode }) => {
  const sheetRoot = document.getElementById("popup-layer");
  if (!sheetRoot) return null;
  return createPortal(children, sheetRoot);
};

export default PortalSheet;
