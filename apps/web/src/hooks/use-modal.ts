import { useModalStore } from "@/features/modal";
import { useCallback, type ReactNode } from "react";

export function useModal() {
  const showModal = useModalStore((state) => state.showModal);
  const hideModal = useModalStore((state) => state.hideModal);

  const show = useCallback(
    (modal: ReactNode) => {
      showModal(modal);
    },
    [showModal]
  );

  const hide = useCallback(() => {
    hideModal();
  }, [hideModal]);

  return { show, hide };
}
