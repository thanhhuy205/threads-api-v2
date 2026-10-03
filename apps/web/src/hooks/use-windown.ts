import { useSyncExternalStore } from "react";

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

type WindowDimensions = {
  windowSize: WindowSize;
  isMobile: boolean;
  isDesktop: boolean;
};

const EMPTY_WINDOW_SNAPSHOT = "undefined:undefined";

const subscribeToWindowResize = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
};

const getWindowSnapshot = () => {
  if (typeof window === "undefined") return EMPTY_WINDOW_SNAPSHOT;
  return `${window.innerWidth}:${window.innerHeight}`;
};

const parseDimension = (value: string) =>
  value === "undefined" ? undefined : Number(value);

export default function useWindow(): WindowDimensions {
  const snapshot = useSyncExternalStore(
    subscribeToWindowResize,
    getWindowSnapshot,
    () => EMPTY_WINDOW_SNAPSHOT,
  );
  const [widthValue, heightValue] = snapshot.split(":");
  const windowSize: WindowSize = {
    width: parseDimension(widthValue),
    height: parseDimension(heightValue),
  };

  const isMobile: boolean =
    typeof windowSize.width === "number" && windowSize.width < 768;
  const isDesktop: boolean =
    typeof windowSize.width === "number" && windowSize.width >= 768;

  return { windowSize, isMobile, isDesktop };
}
