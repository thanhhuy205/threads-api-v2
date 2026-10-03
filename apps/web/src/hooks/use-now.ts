import { useEffect, useState } from "react";

export function useNow(intervalMs = 1_000, enabled = true) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const updateNow = () => setNow(Date.now());
    const initialTimerId = window.setTimeout(updateNow, 0);
    const intervalId = window.setInterval(updateNow, intervalMs);

    return () => {
      window.clearTimeout(initialTimerId);
      window.clearInterval(intervalId);
    };
  }, [enabled, intervalMs]);

  return now;
}
