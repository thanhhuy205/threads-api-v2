"use client";

import { useModalStore } from "@/features/modal";
import dynamic from "next/dynamic";

const ModalPresence = dynamic(() => import("./ModalPresence"), {
  ssr: false,
});

export function ModalProvider() {
  const modal = useModalStore((state) => state.modal);
  return <ModalPresence>{modal}</ModalPresence>;
}
