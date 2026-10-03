import type { ReactNode } from "react";
import { create } from "zustand";

type ModalState = {
  modal: ReactNode | null;
  showModal: (modal: ReactNode) => void;
  hideModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  modal: null,
  showModal: (modal) => set({ modal }),
  hideModal: () => set({ modal: null }),
}));
